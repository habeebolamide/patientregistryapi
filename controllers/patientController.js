const Patient = require('../models/patient')
const bcrypt = require('bcrypt')
const lodash = require('lodash')
const jwt = require('jsonwebtoken')
const { accessToken } = require("../helpers/authHelper");

exports.createPatient = async (req,res) => {
    bcrypt.hash(req.body.password, 10 , async function(err, hashedPass) {
        if (err) {
           res.json({
            error :err
           })
        }
        let patient = new Patient ({
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            username:req.body.username,
            dob:req.body.dob,
            email:req.body.email,
            phone : req.body.phone,
            password:hashedPass,
        })
        const token = await accessToken({ email: patient.email,_id: patient._id });
        patient.save()
        .then ( result => {
                res.json({
                    token,
                    patient,
                    message : " User Added Sucessfully "
                })
        })
        .catch((err) => {
            res.status(404).json({
                error : err.errors
            })
        })
    })
}

exports.login =  async(req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  Patient.findOne({ email: email })
    .then((patient) => {
      if (patient) {
        bcrypt.compare(password, patient.password, async function (err, result) {
          if (err) {
            res.json({
              error: err,
            });
          }
          if (result) {
            const token = await accessToken({email:email, _id: patient._id});
            res.json({
              message: "Login Successful",
              token: token,
              patient
            });
          } else {
            res.status(404).json({
              message: "Invalid password",
            });
          }
        });
      } else {
        res.status(404).json({
          message: "No User Found",
        });
      }
    })
    .catch((err) => {
      res.status(404).json({
        error: "Invalid Credentials",
      });
    });
};
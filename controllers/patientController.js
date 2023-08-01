const Patient = require('../models/patient')
const bcrypt = require('bcrypt')
const cloudinary = require('cloudinary').v2;
const { accessToken } = require("../helpers/authHelper");
          
cloudinary.config({ 
  cloud_name: 'doxc97i8f', 
  api_key: '516413365421229', 
  api_secret: 'oBlNnA28Qy978cacZSeLxoffqa8' 
});
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
            avatar:"https://res.cloudinary.com/crownbirthltd/image/upload/v1597424758/psitywq3w0z4wzpojmp8.png",
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
              message: "Invalid Credentials",
            });
          }
        });
    })
    .catch((err) => {
      res.status(404).json({
        error: "Invalid Credentials",
      });
    });
};

exports.me = async(req,res) =>{
  Patient.findOne({_id:res.locals.user._id})
  .then((patient) => {
      res.json({
        patient,
        staus:true
      })
  })
  .catch((err) => {
      res.json({
          error:err,
          status:false
      })
  })
}
exports.upload = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);

    Patient.findByIdAndUpdate(
      { _id: res.locals.user._id },
      { avatar: result.secure_url }
    )
      .then(() => {
        res.json({
          url: result.secure_url,
          message: "Image Uploaded Successfully",
          status: true,
        });
      })
      .catch((err) => {
        res.json({
          message: err.message,
          status: false,
        });
      });
  } catch (error) {
    res.status(400).json({
      message: error,
      status: false,
    });
  }
};

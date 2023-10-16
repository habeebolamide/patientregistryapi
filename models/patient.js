/* eslint-disable func-names */
/* eslint-disable consistent-return */
const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const userTypes = ['user', 'admin'];

const patientSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true
    },

    avatar: {
      type: String,
      required: true
    },
 
    lastname: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    dob: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    user_type: {
      type: String,
      enum: userTypes,
      default: 'user'
    },
    password: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
  },
  { timestamps: true }
);


const Patient = mongoose.model("Patient", patientSchema);

const newPatient =  bcrypt.hash('12345678', 10 , async function(err, hashedPass) {
  if (err) {
     res.json({
      error :err
     })
  }
  let patient = new Patient ({
      firstname:"fawas",
      lastname:"kareem",
      username:"David",
      avatar:"https://res.cloudinary.com/crownbirthltd/image/upload/v1597424758/psitywq3w0z4wzpojmp8.png",
      dob:"29-05-2005",
      email:"test@test.com",
      phone : "08162816543",
      password:hashedPass,
  })
  patient.save()
  .then ( result => {
    // res.json({
    //     patient,
    //     message : " User Added Sucessfully "
    // })
  })
  .catch((err) => {
      // res.status(404).json({
      //     error : err.errors
      // })
  })
})


module.exports = Patient;

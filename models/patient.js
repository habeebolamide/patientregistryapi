/* eslint-disable func-names */
/* eslint-disable consistent-return */
const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true
    },
 
    lastname: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
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

module.exports = Patient;

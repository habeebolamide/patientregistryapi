const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient'
    }],

    messages: [{
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
      },
      username: {
        type: String,
        required: true,
      },
    }],

    disease : {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Disease',
      required:true
    }
  },
  { timestamps: true }
);

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;

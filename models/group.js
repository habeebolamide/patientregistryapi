const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true,'Group Name is required']
    },

    members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient'
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

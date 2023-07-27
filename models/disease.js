
const mongoose = require("mongoose");
const Group = require("./group");

const diseaseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    synonyms: {
      type: Array,
      required: false
    },
    symptoms: {
      type: Array,
      required: true
    },
    causes: {
      type: Array,
      required: false
    }

  },
  { timestamps: true }
);

diseaseSchema.post("save", async (result) => {
  try {
    await Group.create({ name: result.name });
  } catch (error) {
    throw InternalServerError("error creating group for disease");
  }
});
const Disease = mongoose.model("Disease", diseaseSchema);

module.exports = Disease;

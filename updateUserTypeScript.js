const mongoose = require("mongoose");
const Patient  = require("./models/patient"); // Update this path
require('dotenv').config();

const updateUserTypeForExistingUsers = async () => {
  try {
    // Update existing documents to add the 'user_type' field with default value 'user'
    const updateQuery = { user_type: { $exists: false } };
    const updateOperation = {
      $set: { user_type: 'user' }
    };

    const result = await Patient.updateMany(updateQuery, updateOperation);

    console.log('Modified documents:', result.modifiedCount);
  } catch (error) {
    console.error('Error updating documents:', error);
  }
};

  mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected Successfully');
    updateUserTypeForExistingUsers();
}).catch((err) => {
    console.log(err);
})
// models/message.js
const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    message: { type: String, required: true },
    user: { type: String, required: true },
    avatar: { type: String, required: true },
    groupId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', chatMessageSchema);

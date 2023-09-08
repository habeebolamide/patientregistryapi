// models/message.js
const mongoose = require('mongoose');

const Webhook = new mongoose.Schema({
    webhook: { type: Array, required: true },
});

module.exports = mongoose.model('Webhook', Webhook);

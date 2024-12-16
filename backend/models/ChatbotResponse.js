const mongoose = require('mongoose');

const chatbotResponseSchema = new mongoose.Schema({
  trigger: { type: String, required: true },
  response: { type: String, required: true }
}, { timestamps: true });

const ChatbotResponse = mongoose.model('ChatbotResponse', chatbotResponseSchema);

module.exports = ChatbotResponse;

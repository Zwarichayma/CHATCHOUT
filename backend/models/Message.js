// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    userMessage: {
      type: String,
      required: true
    },
    chatbotReply: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;

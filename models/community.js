const mongoose = require('mongoose')
const connection = require('../utils/database')

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  user: {
    type: String,
    required: true,
  },
})

// Define the schema for the rooms
const communitySchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
  messages: {
    type: [messageSchema],
    capped: 1048576, // 1MB capped collection
  },
})

const Community = connection.model('Community', communitySchema)

module.exports = Community

const mongoose = require('mongoose')
const connection = require('../utils/database')
const Jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
  otp: {
    type: String,
    required: false,
    expires: '5m',
    index: { expires: '5m' },
  },
  attempts: {
    type: Number,
    required: false,
    expires: '5m',
    index: { expires: '5m', expireAfterSeconds: 300 },
  },
  cart: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  coursesPurchased: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
  ],
})

userSchema.methods.generateAuthToken = () => {
  const token = Jwt.sign({ _id: this._id }, process.env.JWT_TOKEN, {
    expiresIn: '180000',
  })
  return token
}

const User = connection.model('User', userSchema)
module.exports = User

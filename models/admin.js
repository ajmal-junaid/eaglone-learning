const mongoose = require('mongoose')
const connection = require('../utils/database')
const Jwt = require('jsonwebtoken')

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
})

adminSchema.methods.generateAuthToken = () => {
  const token = Jwt.sign({ _id: this._id }, process.env.JWT_TOKEN, {
    expiresIn: '180000',
  })
  return token
}

const Admin = connection.model('Admin', adminSchema)
module.exports = Admin

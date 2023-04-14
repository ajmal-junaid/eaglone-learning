const bcrypt = require('bcrypt')
const User = require('../models/user')
const Jwt = require('jsonwebtoken')
const jwtKey = process.env.JWT_TOKEN
const nodemailer = require('nodemailer')
const crypto = require('crypto')

module.exports = {
  userSignup: async (req, res) => {
    try {
      const { email, mobile } = req.body
      const userEmail = await User.findOne({ email: email })
      const userPhone = await User.findOne({ mobile: mobile })
      if (userEmail)
        return res.status(212).json({
          success: false,
          err: true,
          message: 'This Email Is Already Registered',
        })
      if (userPhone)
        return res.status(212).json({
          success: false,
          err: true,
          message: 'This Phone Is Already Registered',
        })
      req.body.password = await bcrypt.hash(req.body.password, 10)
      req.body.active = false
      const otp = Math.floor(100000 + Math.random() * 900000)
      req.body.otp = otp

      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.YOUR_EMAIL,
          pass: process.env.YOUR_PASSWORD,
        },
      })

      const mailOptions = {
        from: process.env.YOUR_EMAIL,
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP for verification is ${otp}. This OTP is valid for 5 minutes.`,
      }

      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          console.log(error)
          res.json({
            err: true,
            success: false,
            message: 'Failed to send OTP.',
          })
        } else {
          await User.create(req.body)
          console.log('Email sent: ' + info.response)
          res.json({
            success: true,
            message: 'OTP sent successfully.',
            data: { key: 'not displayable' },
          })
        }
      })
    } catch (error) {
      console.log(error.message, 'catch')
      return res
        .status(300)
        .json({ success: false, err: true, message: 'something went wrong' })
    }
  },
  verifyEmail: async (req, res) => {
    try {
      const { email, otp } = req.body

      const user = await User.findOne({ email })
      if (!user) {
        return res.status(203).json({ err: true, message: 'User not found' })
      }
      if (otp !== user.otp) {
        return res
          .status(203)
          .json({ err: true, message: 'Invalid OTP or Otp expired' })
      }
      user.active = true
      user.otp = undefined
      await user.save()
      Jwt.sign(
        {
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          _id: user._id,
        },
        jwtKey,
        { expiresIn: 86400 },
        (err, token) => {
          if (err)
            return res
              .status(212)
              .json({ err: true, message: 'error in token generation' })
          if (token)
            return res.status(200).json({
              token,
              success: true,
              message: 'Email verified successfully',
            })
        }
      )
    } catch (error) {
      console.error(error)
      res
        .status(500)
        .json({ err: true, message: 'Something went wrong', reason: error })
    }
  },
  userLogin: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email })
      if (user) {
        if (!user.attempts || user.attempts < 5) {
          const result = await bcrypt.compare(req.body.password, user.password)
          if (result) {
            if (!user.active)
              return res.status(400).json({
                err: true,
                message:
                  'User is Deactivated,Contact Admin/try forgot password',
              })
            Jwt.sign(
              {
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                _id: user._id,
              },
              jwtKey,
              { expiresIn: 86400 },
              (err, token) => {
                if (err)
                  return res
                    .status(500)
                    .json({ err: true, message: 'error in token generation' })
                if (token)
                  return res.status(200).json({
                    err: false,
                    token: token,
                    message: 'Logged In Succesfully',
                  })
              }
            )
          } else {
            if (user.attempts) {
              user.attempts++
              if (user.attempts === 5) {
                user.active = false
              }
            } else {
              user.attempts = 1
            }
            user.save()
            return res
              .status(401)
              .json({ err: true, message: 'wrong password' })
          }
        } else {
          return res.status(305).json({
            err: true,
            message:
              'Limit Reached,Try again after five minutes/Reset Password',
          })
        }
      } else {
        return res.status(404).json({ err: true, message: 'user not found' })
      }
    } catch (error) {
      return res
        .status(500)
        .json({ err: true, message: 'Something went wrong', error: error })
    }
  },
  viewPurchasedCourses: async (req, res) => {
    try {
      const userId = req.params.id
      const user = await User.findById(userId).populate('coursesPurchased')
      res.status(200).json({
        err: false,
        message: 'course fetched successfully',
        data: user.coursesPurchased,
      })
    } catch (error) {
      return res
        .status(500)
        .json({ err: true, message: 'Something went wrong', error: error })
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body
      const user = await User.findOne({ email: email })
      if (!user)
        return res.status(404).json({ err: true, message: 'User Not Found' })
      const tokenValue = crypto.randomBytes(32).toString('hex')
      user.otp = tokenValue
      user.save()
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.YOUR_EMAIL,
          pass: process.env.YOUR_PASSWORD,
        },
      })
      const mailOptions = {
        from: process.env.YOUR_EMAIL,
        to: email,
        subject: 'Password reset',
        text: `Please click on the following link to reset your password: https://eaglone.online/user/reset-password/${tokenValue}`,
      }
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error)
        } else {
          console.log(`Email sent: ${info.response}`)
        }
      })
      res.status(200).json({
        err: false,
        message: 'Password reset link sent to your email',
      })
    } catch (error) {
      console.log(error)
      return res
        .status(500)
        .json({ err: true, message: 'Something went wrong', error: error })
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { tokenValue, newPassword } = req.body
      const user = await User.findOne({ otp: tokenValue })
      if (!user)
        return res
          .status(404)
          .json({ err: true, message: 'Invalid Token ....' })
      if (!user.otp)
        return res
          .status(404)
          .json({ err: true, message: 'Token Expired, Try again ....' })
      if (tokenValue !== user.otp)
        return res
          .status(404)
          .json({ err: true, message: 'Invalid Token ....' })
      user.password = await bcrypt.hash(newPassword, 10)
      user.active = true
      user.otp = undefined
      user.attempts = 0
      await user.save()
      return res
        .status(200)
        .json({ err: false, message: 'Password reset Successfull' })
    } catch (error) {
      console.log(error)
      return res
        .status(500)
        .json({ err: true, message: 'Something went wrong', error: error })
    }
  },
}

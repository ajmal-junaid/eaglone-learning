const bcrypt = require('bcrypt')
const Admin = require('../models/admin')
const User = require('../models/user')
const Jwt = require('jsonwebtoken')
const jwtKey = process.env.JWT_TOKEN
const s3 = require('../utils/awsbucket')
module.exports = {
    adminLogin: async (req, res) => {
        try {
            if (!req.body.email || !req.body.password) return res.status(400).json({ err: true, message: "Invalid data" })
            const admin = await Admin.findOne({ email: req.body.email });
            if (admin) {
                const isPassword = await bcrypt.compare(req.body.password, admin.password);
                if (isPassword) {
                    Jwt.sign({ admin }, jwtKey, { expiresIn: 86400 }, (err, token) => {
                        if (err) return res.status(500).json({ err: true, message: "error in token generation" })
                        if (token) return res.status(200).json({ token: token, message: "Logged In Succesfully", adminMail: admin.email })
                    })
                } else {
                    return res.status(401).json({ err: true, message: "wrong password" })
                }
            } else {
                return res.status(404).json({ err: true, message: "admin not found" })
            }
        } catch (error) {
            return res.status(500).json({ err: true, message: "Something went wrong", reason: error })
        }
    },
    getAllUsers: async (req, res) => {
        try {
            const userData = await User.find({}).select("-password");
            if (userData) {
                return res.status(200).json({ message: "success", userData })
            } else {
                return res.status(404).json({ err: true, message: "Users not found on DB" })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ err: true, message: "something went wrong", error })
        }
    }
}
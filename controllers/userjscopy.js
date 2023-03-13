const bcrypt = require('bcrypt')
const User = require('../models/user');
const Jwt = require('jsonwebtoken')
const jwtKey = process.env.JWT_TOKEN
const nodemailer = require('nodemailer');


module.exports = {
    userSignup: async (req, res) => {
        try {
            const userEmail = await User.findOne({ email: req.body.email });
            const userPhone = await User.findOne({ mobile: req.body.mobile });
            if (userEmail) return res.status(200).json({ err: true, message: "This Email Is Already Registered" });
            if (userPhone) return res.status(200).json({ err: true, message: "This Phone Is Already Registered" });
            req.body.password = await bcrypt.hash(req.body.password, 10);

            const newUser = await User.create(req.body);
            res.status(200).json({ message: "Acoount Created Successfully", userData: newUser });
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({ err: true, message: "something went wrong" });
        }
    },
    userLogin: async (req, res) => {
        console.log("bodyyyy", req.body);
        try {
            const user = await User.findOne({ email: req.body.email });
            console.log(user);
            if (user) {
                const result = await bcrypt.compare(req.body.password, user.password);
                if (result) {
                    if (!user.active) return res.status(200).json({ err: true, message: "User is Deactivated,Contact Admin" })
                    Jwt.sign({ user }, jwtKey, { expiresIn: 86400 }, (err, token) => {
                        if (err) return res.status(200).json({ err: true, message: "error in token generation" })
                        if (token) return res.status(200).json({ auth: true, token: token, message: "Logged In Succesfully" })
                    })
                } else {
                    return res.status(200).json({ err: true, message: "wrong password" })
                }
            } else {
                return res.status(200).json({ err: true, message: "user not found" })
            }
        } catch (error) {
            return res.status(300).json({ err: true, message: "Something went wrong", reason: error })
        }
    }

}
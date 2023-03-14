const bcrypt = require('bcrypt')
const User = require('../models/user');
const Jwt = require('jsonwebtoken')
const jwtKey = process.env.JWT_TOKEN
const nodemailer = require('nodemailer');


module.exports = {
    // userSignup: async (req, res) => {
    //     try {
    //         const userEmail = await User.findOne({ email: req.body.email });
    //         const userPhone = await User.findOne({ mobile: req.body.mobile });
    //         if (userEmail) return res.status(200).json({ err: true, message: "This Email Is Already Registered" });
    //         if (userPhone) return res.status(200).json({ err: true, message: "This Phone Is Already Registered" });
    //         req.body.password = await bcrypt.hash(req.body.password, 10);
    //         req.body.otp = Math.floor(100000 + Math.random() * 900000); //otp generation
    //         const newUser = await User.create(req.body);

    //         const transporter = nodemailer.createTransport({
    //             service: 'gmail',
    //             auth: {
    //                 user: process.env.EMAIL_USER,
    //                 pass: process.env.EMAIL_PASS
    //             }
    //         });
    //         const mailOptions = {
    //             from: process.env.EMAIL_USER,
    //             to: email,
    //             subject: 'Verify your email address',
    //             html: `<p>Your OTP for email verification is <strong>${otp}</strong></p>`
    //         };
    //         await transporter.sendMail(mailOptions);

    //         res.status(200).json({ otpsent: true, message: "Acoount Created Successfully, Please Verify your Email", userData: newUser });
    //     } catch (error) {
    //         console.log(error.message);
    //         return res.status(300).json({ err: true, message: "something went wrong" });
    //     }
    // },
    userSignup: async (req, res) => {
        try {
            const { email, mobile, name } = req.body;
            const userEmail = await User.findOne({ email: email });
            const userPhone = await User.findOne({ mobile: mobile });
            if (userEmail) return res.status(212).json({ err: true, message: "This Email Is Already Registered" });
            if (userPhone) return res.status(212).json({ err: true, message: "This Phone Is Already Registered" });
            req.body.password = await bcrypt.hash(req.body.password, 10);
            const otp = Math.floor(100000 + Math.random() * 900000);
            req.body.otp=otp;
           
            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: process.env.YOUR_EMAIL,
                    pass: process.env.YOUR_PASSWORD
                }
            });

            const mailOptions = {
                from: process.env.YOUR_EMAIL,
                to: email,
                subject: "OTP Verification",
                text: `Your OTP for verification is ${otp}. This OTP is valid for 5 minutes.`,
            };

            transporter.sendMail(mailOptions, async (error, info) => {
                if (error) {
                    console.log(error);
                    res.json({err:true, success: false, message: "Failed to send OTP." });
                } else {
                    const newUser = await User.create(req.body);
                    console.log("Email sent: " + info.response);
                    res.json({ success: true, message: "OTP sent successfully.", newUser });
                }
            });
        } catch (error) {
            console.log(error.message,"catch");
            return res.status(300).json({ err: true, message: "something went wrong" });
        }
    },
    verifyEmail: async (req, res) => {
        try {
            const { email, otp } = req.body;
            
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(200).json({err:true, message: 'User not found' });
            }
            if (otp !== user.otp) {
                return res.status(200).json({err:true, message: 'Invalid OTP' });
            }
            user.active = true;
            user.otp = undefined;
            await user.save();
            res.status(200).json({success:true, message: 'Email verified successfully' });
        } catch (error) {
            console.error(error);
            res.status(300).json({ err: true, message: "Something went wrong", reason: error })
        }
    },
    userLogin: async (req, res) => {
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
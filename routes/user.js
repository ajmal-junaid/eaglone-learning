const express = require('express');
const bcrypt = require('bcrypt')
const User = require('../models/user');
const router = express.Router();
const { verifyApiKey, verifyUser } = require('../middlewares/verifications')

router.post('/user-signup', verifyApiKey, async (req, res) => {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        const userEmail = await User.findOne({ email: req.body.email });
        const userPhone = await User.findOne({ mobile: req.body.mobile });
        if (userEmail) return res.status(400).json({ err: true, message: "This Email Is Already Registered" });
        if (userPhone) return res.status(400).json({ err: true, message: "This Phone Is Already Registered" });

        console.log("new user");
        const newUser = await User.create(req.body);
        res.status(200).json({ err: true, message: "Acoount Created Successfully", userData: newUser });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ err: true, message: "something went wrong" });
    }
})



module.exports = router
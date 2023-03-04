const bcrypt = require('bcrypt')
const User = require('../models/user');
module.exports={
    userSignup:async (req, res) => {
        try {
            req.body.password = await bcrypt.hash(req.body.password, 10);
            const userEmail = await User.findOne({ email: req.body.email });
            const userPhone = await User.findOne({ mobile: req.body.mobile });
            if (userEmail) return res.status(400).json({ err: true, message: "This Email Is Already Registered" });
            if (userPhone) return res.status(400).json({ err: true, message: "This Phone Is Already Registered" });
    
            console.log("new user");
            const newUser = await User.create(req.body);
            res.status(200).json({ message: "Acoount Created Successfully", userData: newUser });
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({ err: true, message: "something went wrong" });
        }
    },
    userLogin:async (req, res) => {
        console.log("bodyyyy", req.body);
        
        try {
            const user = await User.findOne({ email: req.body.email });
            console.log(user);
            if (user) {
                const result = await bcrypt.compare(req.body.password, user.password);
                if (result) {
                    //jwt token
                    return res.status(200).json({ login: true })
                } else {
                    return res.status(400).json({ err: true, message: "wrong password" })
                }
            } else {
                return res.status(400).json({ err: true, message: "user not found" })
            }
        } catch (error) {
            return res.status(500).json({ err: true, message: "Something went wrong",reason:error })
        }
    }

}
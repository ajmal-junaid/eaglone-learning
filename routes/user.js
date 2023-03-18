const express = require('express');
const router = express.Router();
const { verifyUser } = require('../middlewares/verifications')
const { userLogin, userSignup, verifyEmail , sendOtp} = require('../controllers/user')
router.get('/',(req,res)=>{
    console.log("fdghjhjkdfgs");
    res.status(200).json({otpsent:true,data:"ajmal"})
})
router.post('/user-signup',userSignup)

router.post('/verify-email',verifyEmail)

router.post('/user-login',userLogin)

module.exports = router
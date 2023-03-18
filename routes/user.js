const express = require('express');
const router = express.Router();
const { verifyUser } = require('../middlewares/verifications')
const { userLogin, userSignup, verifyEmail , sendOtp} = require('../controllers/user')
router.get('/test',(req,res)=>{
    console.log("api is working");
    res.status(200).json({apiWorking:true,data:"api is working try with key"})
})
router.post('/user-signup',userSignup)

router.post('/verify-email',verifyEmail)

router.post('/user-login',userLogin)

module.exports = router
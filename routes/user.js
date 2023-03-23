const express = require('express');
const router = express.Router();
const { userLogin, userSignup, verifyEmail, sendOtp } = require('../controllers/user');
const { getAllCourses, getFreeCourses } = require('../controllers/course');
const { getCategory } = require('../controllers/category');
const { addToCart } = require('../controllers/cart');

router.get('/test', (req, res) => {
    console.log("api is working");
    res.status(200).json({ apiWorking: true, data: "api is working try with key" })
})
router.post('/user-signup', userSignup)

router.post('/verify-email', verifyEmail)

router.post('/user-login', userLogin)

router.get('/courses', getAllCourses)

router.get('/categories', getCategory)

router.post('/add-to-cart',addToCart)

router.get('/free-courses',getFreeCourses)

module.exports = router
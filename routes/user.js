const express = require('express');
const router = express.Router();
const { userLogin, userSignup, verifyEmail, sendOtp, viewPurchasedCourses } = require('../controllers/user');
const { getAllCourses, getFreeCourses, getCourseByCategoryName, getPaidCourses, getCourseById, getCourseByCourseId } = require('../controllers/course');
const { getCategory, getCategoryByName } = require('../controllers/category');
const { addToCart, removeCourse, getCartCourses } = require('../controllers/cart');
const { getAllLessonsByCourse, getAllLessonsByCourseId } = require('../controllers/lesson');
const { verifyUser } = require('../middlewares/verifications');
const { applyCoupon } = require('../controllers/coupon');
const { createOrder } = require('../controllers/order');

router.get('/test', (req, res) => {
    console.log("api is working");
    res.status(200).json({ apiWorking: true, data: "api is working try with key" })
})
router.post('/user-signup', userSignup)

router.post('/verify-email', verifyEmail)

router.post('/user-login', userLogin)

router.get('/courses', getAllCourses)

router.get('/categories', getCategory)

router.get('/free-courses',getFreeCourses)

router.get('/paid-courses',getPaidCourses)

router.get('/get-course-category/:id',getCourseByCategoryName)

router.get('/course/:id',getCourseByCourseId);

router.get('/get-lessons-course/:id',getAllLessonsByCourse)

router.get('/category-details/:id',getCategoryByName);

router.post('/add-to-cart',verifyUser,addToCart)

router.post('/remove-from-cart',removeCourse)

router.get('/get-cart',getCartCourses);

router.post('/apply-coupon',applyCoupon);

router.post('/create-order',createOrder)

router.get('/get-purchased-courses/:id',viewPurchasedCourses)

router.get('/get-lessons-pcourse/:id',getAllLessonsByCourseId)

router.get('/cours/:id',getCourseById);


module.exports = router
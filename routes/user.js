const express = require('express');
const router = express.Router();
const { userLogin, userSignup, verifyEmail, viewPurchasedCourses, forgotPassword, resetPassword } = require('../controllers/user');
const { getAllCourses, getFreeCourses, getCourseByCategoryName, getPaidCourses, getCourseById, getCourseByCourseId, searchCourse, rateCourse } = require('../controllers/course');
const { getCategory, getCategoryByName } = require('../controllers/category');
const { addToCart, removeCourse, getCartCourses, addFreeCourse } = require('../controllers/cart');
const { getAllLessonsByCourse, getAllLessonsByCourseId, getVideo } = require('../controllers/lesson');
const { verifyUser } = require('../middlewares/verifications');
const { applyCoupon } = require('../controllers/coupon');
const { createOrder, payment, verifyPayment, getOrders } = require('../controllers/order');
const { getBanner } = require('../controllers/banner');
const { getMessages } = require('../controllers/community');

router.get('/test', (req, res) => {
    console.log("api is working");
    res.status(200).json({ apiWorking: true, data: "api is working try with key" })
})
router.post('/user-signup', userSignup)

router.post('/verify-email', verifyEmail)

router.post('/user-login', userLogin)

router.get('/courses', getAllCourses)

router.get('/categories', getCategory)

router.get('/free-courses', getFreeCourses)

router.get('/paid-courses', getPaidCourses)

router.get('/get-course-category/:id', getCourseByCategoryName)

router.get('/course/:id', getCourseByCourseId)

router.get('/get-lessons-course/:id', getAllLessonsByCourse)

router.get('/category-details/:id', getCategoryByName)

router.post('/add-to-cart', verifyUser, addToCart)

router.post('/remove-from-cart',verifyUser, removeCourse)

router.get('/get-cart',verifyUser, getCartCourses)

router.post('/apply-coupon',verifyUser, applyCoupon)

router.post('/create-order',verifyUser, createOrder)

router.get('/get-purchased-courses/:id',verifyUser, viewPurchasedCourses)

router.get('/get-lessons-pcourse/:id', getAllLessonsByCourseId)

router.get('/cours/:id', getCourseById)

router.post('/add-free-course',verifyUser, addFreeCourse)

router.get('/banners', getBanner)

router.post('/payment', payment)

router.post('/confirm-payment', verifyPayment)

router.get('/get-orders/:id',verifyUser, getOrders)

router.get('/search/:key', searchCourse)

router.get('/community',verifyUser, getMessages)

router.get('/video',verifyUser, getVideo)

router.post('/forgot-password', forgotPassword)

router.post('/reset-password',resetPassword);

router.post('/rate-course',verifyUser,rateCourse)


module.exports = router
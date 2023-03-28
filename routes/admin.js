const express = require('express');
const router = express.Router();
const { adminLogin, getAllUsers } = require('../controllers/admin');
const { addBanner, getBanner } = require('../controllers/banner');
const { addCategory, getCategory, getCategoryById, updateCategory, deleteCategoryById } = require('../controllers/category');
const { addCoupon, deleteCoupon, getAllCoupons } = require('../controllers/coupon');
const { addCourse, getAllCourses, getCourseById, updateCourse } = require('../controllers/course');
const { addLesson, getAllLessons, getALesson, updateLesson } = require('../controllers/lesson')
const { verifyUser } = require('../middlewares/verifications');
const { upload, uploadVideo } = require('../utils/multer')

router.post('/login', adminLogin);

router.get('/users', getAllUsers);

router.post("/add-category", upload.single("image"), addCategory);

router.get('/categories', getCategory)

router.post("/add-course", upload.single('image'), addCourse);

router.get('/courses', verifyUser, getAllCourses)

router.get('/course/:id', getCourseById)

router.put("/update-course/:id", upload.single('image'), updateCourse);

router.get('/category/:id', getCategoryById)

router.put("/update-category/:id", upload.single('image'), updateCategory);

router.delete('/delete-category/:id', deleteCategoryById)

router.post('/add-lesson', uploadVideo.single('video'), addLesson);

router.get('/lessons', getAllLessons)

router.get('/lesson/:id', getALesson)

router.put('/update-lesson/:id', uploadVideo.single('video'), updateLesson);

router.post('/add-coupon', addCoupon)

router.delete('/delete-coupon/:id', deleteCoupon)

router.get('/coupons',getAllCoupons)

router.post('/add-banner', upload.single("image"), addBanner);

router.get('/get-banner',getBanner)








module.exports = router
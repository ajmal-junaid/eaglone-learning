const express = require('express')
const router = express.Router()
const { adminLogin, getAllUsers } = require('../controllers/admin')
const { addBanner, getBanner, deleteBanner } = require('../controllers/banner')
const {
  addCategory,
  getCategory,
  getCategoryById,
  updateCategory,
  deleteCategoryById,
} = require('../controllers/category')
const {
  addCoupon,
  deleteCoupon,
  getAllCoupons,
} = require('../controllers/coupon')
const {
  addCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
} = require('../controllers/course')
const {
  addLesson,
  getAllLessons,
  getALesson,
  updateLesson,
} = require('../controllers/lesson')
const { verifyUser } = require('../middlewares/verifications')
const { upload, uploadVideo } = require('../utils/multer')
const { getAllOrders } = require('../controllers/order')

router.post('/login', adminLogin)

router.get('/users', verifyUser, getAllUsers)

router.post('/add-category', verifyUser, upload.single('image'), addCategory)

router.get('/categories', verifyUser, getCategory)

router.post('/add-course', verifyUser, upload.single('image'), addCourse)

router.get('/courses', verifyUser, getAllCourses)

router.get('/course/:id', verifyUser, getCourseById)

router.put(
  '/update-course/:id',
  verifyUser,
  upload.single('image'),
  updateCourse
)

router.get('/category/:id', verifyUser, getCategoryById)

router.put(
  '/update-category/:id',
  verifyUser,
  upload.single('image'),
  updateCategory
)

router.delete('/delete-category/:id', verifyUser, deleteCategoryById)

router.post('/add-lesson', verifyUser, uploadVideo.single('video'), addLesson)

router.get('/lessons', verifyUser, getAllLessons)

router.get('/lesson/:id', verifyUser, getALesson)

router.put(
  '/update-lesson/:id',
  verifyUser,
  uploadVideo.single('video'),
  updateLesson
)

router.post('/add-coupon', verifyUser, addCoupon)

router.delete('/delete-coupon/:id', verifyUser, deleteCoupon)

router.get('/coupons', verifyUser, getAllCoupons)

router.post('/add-banner', verifyUser, upload.single('image'), addBanner)

router.get('/banners', verifyUser, getBanner)

router.delete('/delete-banner/:id', verifyUser, deleteBanner)

router.get('/orders', verifyUser, getAllOrders)

module.exports = router
//fas
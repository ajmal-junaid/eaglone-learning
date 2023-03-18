const express = require('express');
const router = express.Router();
const multer = require("multer");
const { adminLogin, getAllUsers } = require('../controllers/admin');
const { addCategory, getCategory, getCategoryById, updateCategoryById, deleteCategoryById } = require('../controllers/category')
const { addCourse, getAllCourses, getCourseById, updateCourseById } = require('../controllers/course');
const { verifyUser } = require('../middlewares/verifications');
const upload = require('../utils/multer')
 
router.post('/login', adminLogin);

router.get('/users', getAllUsers);

router.post("/add-category", upload.single("image"), addCategory);

router.get('/categories', getCategory)

router.post("/add-course", upload.single('image'), addCourse);

router.get('/courses',verifyUser, getAllCourses)

router.get('/course/:id',getCourseById)

router.put("/update-course/:id", upload.single('image'), updateCourseById);

router.get('/category/:id',getCategoryById)

router.put("/update-category/:id", upload.single('image'), updateCategoryById);

router.delete('/delete-category/:id',deleteCategoryById)








module.exports = router
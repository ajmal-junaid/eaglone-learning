const express = require('express');
const router = express.Router();
const multer = require("multer");
const { sample, adminLogin, getAllUsers } = require('../controllers/admin');
const { addCategory, getCategory } = require('../controllers/category')
const { addCourse, getAllCourses } = require('../controllers/course');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + "." + file.originalname.split(".").pop());
    },
});
const upload = multer({ storage: storage });


router.get('/', sample)

router.post('/login', adminLogin);

router.get('/users', getAllUsers);

router.post("/add-category", upload.single("image"), addCategory);

router.get('/categories', getCategory)

router.post("/add-course",upload.single('image'),addCourse);

router.get('/courses',getAllCourses)







module.exports = router

//connect mongodb in node
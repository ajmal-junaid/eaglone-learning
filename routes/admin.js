const express = require('express');
const router = express.Router();
const { sample, adminLogin, getAllUsers } = require('../controllers/admin');
const { addCategory } = require('../controllers/category')
const multer = require("multer");


// Define storage for the uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + "." + file.originalname.split(".").pop());
    },
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });




router.get('/', sample)

router.post('/login', adminLogin);

router.get('/users', getAllUsers);

router.post("/add-category", upload.single("image"), addCategory);







module.exports = router

//connect mongodb in node
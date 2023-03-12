const Course = require('../models/course');
let objectId = require('mongodb').ObjectId;

module.exports={
    addCourse:async(req,res)=>{
        try {
            console.log("bodyyyy", req.body);
            let { courseId, title,category,premium } = req.body;
            if (!courseId || !title || !category || !premium) return res.status(206).json({ err: true, message: "Enter all required fields" })
            req.body.courseId = courseId.toLowerCase()
            const course = await Course.findOne({ courseId: req.body.courseId })
            if (course) return res.status(208).json({ err: true, message: "Course with this Id is Already Exists" })
            const imageUrl = req.file ? `/images/${req.file.filename}` : null;
            req.body.image = imageUrl;
            req.body.rating=0;
            req.body.classes=0;
            req.body.views = 0
            const success = await Course.create(req.body)
            console.log("success",success);
            if (success) return res.status(201).json({ message: "Course Added Succesfully" })
            return res.status(201).json({ err: true, message: "Course Creation Failed" })
        } catch (error) {
            return res.status(212).json({ err: true, message: "something Wrong", reason: error })
        }
    },
    getAllCourses:async(req,res)=>{
        try {
            const course = await Course.find();
            if (!course) return res.status(204).json({ err: true, message: "No courses found" })
            return res.status(200).json({ message: "Course fetched Successfully", data: course })
        } catch (error) {
            return res.status(212).json({ err: true, message: "something Wrong", reason: error })
        }
    }
}
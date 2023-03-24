const Course = require('../models/course');
let objectId = require('mongodb').ObjectId;

module.exports = {
    isAnyCourse: async (name) => {
        return await Course.find({ category: name }).count() > 0;
    },
    addCourse: async (req, res) => {
        try {
            let { courseId, title, category, premium } = req.body;
            if (!courseId || !title || !category || !premium) return res.status(422).json({ err: true, message: "Enter all required fields" })
            req.body.courseId = courseId.toLowerCase()
            const course = await Course.findOne({ courseId: req.body.courseId })
            if (course) return res.status(409).json({ err: true, message: "Course with this Id is Already Exists" })
            const imageUrl = req.file ? `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${req.file.key}` : category.image;
            req.body.image = imageUrl;
            req.body.rating = 0;
            req.body.classes = 0;
            req.body.views = 0
            req.body.price = req.body.price ? req.body.price : 0;
            const success = await Course.create(req.body)
            if (success) return res.status(200).json({ message: "Course Added Succesfully" })
            return res.status(500).json({ err: true, message: "Course Creation Failed" })
        } catch (error) {
            return res.status(500).json({ err: true, message: "something Wrong", reason: error })
        }
    },
    getAllCourses: async (req, res) => {
        try {
            const course = await Course.find();
            if (!course) return res.status(204).json({ err: true, message: "No courses found" })
            return res.status(200).json({ message: "Course fetched Successfully", data: course })
        } catch (error) {
            return res.status(212).json({ err: true, message: "something Wrong", reason: error })
        }
    },
    getFreeCourses: async (req, res) => {
        try {
            const course = await Course.find({ premium: false })
            if (course.length < 1) return res.status(404).json({ err: true, message: "No courses found" })
            return res.status(200).json({ err: false, message: "Free Courses fetched Successfully", data: course })
        } catch (error) {
            return res.status(212).json({ err: true, message: "something Wrong", reason: error })
        }
    },
    getCourseById: async (req, res) => {
        try {
            const course = await Course.findOne({ _id: req.params.id })
            if (!course) return res.status(204).json({ err: true, message: "No course found" })
            return res.status(200).json({ message: "Course fetched Successfully", data: course })
        } catch (error) {
            return res.status(212).json({ err: true, message: "something Wrong", reason: error })
        }
    },
    updateCourse: async (req, res) => {
        try {
            const course = await Course.findOne({ _id: req.params.id })
            if (!course) return res.status(204).json({ err: true, message: "No course found" })

            if (req.file != undefined) {
                const imageUrl = req.file ? `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${req.file.key}` : category.image;
                req.body.image = imageUrl;
            } else {
                req.body.image = course.image;
            }
            const result = await Course.updateOne(
                { _id: req.params.id },
                { $set: req.body }
            )
            return res.status(202).json({ message: "Course Updated Successfully", data: result })
        } catch (error) {
            return res.status(212).json({ err: true, message: "something Wrong", reason: error })
        }
    }
}
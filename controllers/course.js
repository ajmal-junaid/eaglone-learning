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
            const imageUrl = req.file ? `https://${process.env.AWS_S3_BUCKET_PUBLIC}.s3.amazonaws.com/${req.file.key}` : category.image;
            req.body.image = imageUrl;
            req.body.rating = 0;
            req.body.classes = 0;
            req.body.views = 0
            req.body.price = req.body.price ? req.body.price : 0;
            req.body.percentage = req.body.percentage ? req.body.percentage : 0;
            req.body.ourPrice = Math.round(req.body.price - (req.body.price * (req.body.percentage / 100)));
            const success = await Course.create(req.body)
            if (success) return res.status(200).json({ message: "Course Added Succesfully" })
            return res.status(500).json({ err: true, message: "Course Creation Failed" })
        } catch (error) {
            return res.status(500).json({ err: true, message: "Something Went Wrong", reason: error })
        }
    },
    getAllCourses: async (req, res) => {
        try {
            const { page = 1, limit = 10 } = req.query;
            const skipIndex = (page - 1) * limit;
            const [courses, count] = await Promise.all([
                Course.find()
                    .sort({ createdAt: -1 })
                    .limit(limit)
                    .skip(skipIndex)
                    .exec(),
                Course.countDocuments()
            ]);
            if (!courses || courses.length === 0) {
                return res.status(404).json({ err: true, message: "No courses found" })
            }
            const totalPages = Math.ceil(count / limit);
            const currentPage = page > totalPages ? totalPages : page;
            return res.status(200).json({ message: "Courses fetched successfully", data: courses, totalPages, currentPage });
        } catch (error) {
            return res.status(500).json({ err: true, message: "Something Went Wrong", reason: error });
        }
    },
    getFreeCourses: async (req, res) => {
        try {
            const course = await Course.find({ premium: false })
            if (course.length < 1) return res.status(404).json({ err: true, message: "No courses found" })
            return res.status(200).json({ err: false, message: "Free Courses fetched Successfully", data: course })
        } catch (error) {
            return res.status(212).json({ err: true, message: "Something Went Wrong", reason: error })
        }
    },
    getPaidCourses: async (req, res) => {
        try {
            const course = await Course.find({ premium: true })
            if (course.length < 1) return res.status(404).json({ err: true, message: "No courses found" })
            return res.status(200).json({ err: false, message: "Premium Courses fetched Successfully", data: course })
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
                const imageUrl = req.file ? `https://${process.env.AWS_S3_BUCKET_PUBLIC}.s3.amazonaws.com/${req.file.key}` : category.image;
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
            return res.status(212).json({ err: true, message: "Something Went Wrong", reason: error })
        }
    },
    getCourseByCategoryName: async (req, res) => {
        try {
            const courses = await Course.find({ category: req.params.id })
            if (courses.length < 1) return res.status(404).json({ err: true, message: "No courses found under this category" })
            return res.status(200).json({ message: "Courses fetched Successfully", data: courses })
        } catch (error) {
            return res.status(500).json({ err: true, message: "Something Went Wrong", reason: error })
        }
    },
    getCourseByCourseId: async (req, res) => {
        try {
            const course = await Course.findOne({ courseId: req.params.id })
            if (!course) return res.status(204).json({ err: true, message: "No course found" })
            return res.status(200).json({ message: "Course fetched Successfully", data: course })
        } catch (error) {
            return res.status(212).json({ err: true, message: "Something Went Wrong", reason: error })
        }
    },
    searchCourse: async (req, res) => {
        try {
            let result = await Course.find({
                "$or": [
                    {
                        title: { $regex: new RegExp(req.params.key, 'i') }
                    },
                    {
                        courseId: { $regex: new RegExp(req.params.key, 'i') }
                    },
                    {
                        category: { $regex: new RegExp(req.params.key, 'i') }
                    }
                ]
            })
            if (!result.length) return res.status(404).json({ err: true, message: "course not found", data: null })
            return res.status(200).json({ err: false, message: "courses fetched successfully", data: result })
        } catch (error) {
            return res.status(500).json({ err: true, message: "Something Went Wrong", reason: error })
        }
    },
    rateCourse: async (req, res) => {
        try {
            const { courseId, rating, comment } = req.body
            const userId = req.token
            const course = await Course.findById(courseId)
            const isRatingExists = course.rating.find(rating=>rating.user.toString()===userId);
            if(isRatingExists) return res.status(400).json({err:true,message:"you have already rated this course"});
            const newRating = {user:userId,rating:rating,comment:comment};
            course.rating.push(newRating);
            await course.save();
            res.status(201).json({err:false,message:"course rated successfully"})
        } catch (error) {
            console.log(error);
            return res.status(500).json({ err: true, message: "Something Went Wrong", reason: error })
        }
    }
}
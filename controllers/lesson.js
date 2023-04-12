const Lesson = require('../models/lesson');
const { HttpRequest } = require("@aws-sdk/protocol-http");
const { S3RequestPresigner } = require("@aws-sdk/s3-request-presigner");
const { parseUrl } = require("@aws-sdk/url-parser");
const { Sha256 } = require("@aws-crypto/sha256-browser");
const { Hash } = require("@aws-sdk/hash-node");
const { formatUrl } = require("@aws-sdk/util-format-url");


module.exports = {
    isLessonExists: async (lessonId) => {
        return await Lesson.find({ lessonId: lessonId }).count > 0;
    },
    addLesson: async (req, res) => {
        try {
            let { lessonId, title, tutorName, course } = req.body;
            if (!lessonId || !title || !tutorName || !course) return res.status(422).json({ err: true, message: "Enter all required fields" })
            req.body.lessonId = lessonId.toLowerCase()
            const lesson = await Lesson.findOne({ lessonId: req.body.lessonId })
            if (lesson) return res.status(409).json({ err: true, message: "lesson with this id is already exists" })
            const videoUrl = req.file ? `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${req.file.key}` : null;
            req.body.video = videoUrl;
            const success = await Lesson.create(req.body)
            if (success) return res.status(200).json({ message: 'lesson added successfully' })
            else return res.status(500).json({ err: true, message: 'lesson not added' })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ err: true, message: "operation failed ", reason: error })
        }
    },
    getAllLessons: async (req, res) => {
        try {
            const lessons = await Lesson.find()
            if (!lessons) return res.status(404).json({ err: true, message: 'lessons not found under this category' })
            return res.status(200).json({ message: "lessons fetched succesfully", data: lessons })
        } catch (error) {
            return res.status(500).json({ err: true, message: "operation failed ", reason: error })
        }
    },
    getLessons: async (req, res) => {
        try {
            const { courseId } = req.query;
            const lessons = Lesson.find({ course: courseId })
            if (!lessons) return res.status(404).json({ err: true, message: 'lessons not found under this category' })
            return res.status(200).json({ message: "lessons fetched succesfully", data: lessons })
        } catch (error) {
            return res.status(500).json({ err: true, message: "operation failed ", reason: error })
        }
    },
    getALesson: async (req, res) => {
        try {
            const lesson = await Lesson.findOne({ _id: req.params.id })
            if (!lesson) return res.status(404).json({ err: true, message: 'lesson not found under this category' })
            return res.status(200).json({ message: "lesson fetched succesfully", data: lesson })
        } catch (error) {
            return res.status(500).json({ err: true, message: "operation failed ", reason: error })
        }
    },
    deleteLesson: async (req, res) => {
        try {
            const result = await Lesson.deleteOne({ lessonId: req.params.id })
            return res.status(200).json({ message: "Lesson deleted Successfully", data: result })
        } catch (error) {
            return res.status(500).json({ err: true, message: "something Wrong", reason: error })
        }
    },
    updateLesson: async (req, res) => {
        try {
            const lesson = await Lesson.findOne({ _id: req.params.id })
            if (!lesson) return res.status(404).json({ err: true, message: "No Lesson found" })
            const videoUrl = req.file ? `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${req.file.key}` : lesson.video;
            req.body.video = videoUrl;
            const result = await Lesson.updateOne(
                { _id: req.params.id },
                { $set: req.body }
            )
            return res.status(200).json({ message: "Lesson Updated Successfully", data: result })
        } catch (error) {
            return res.status(500).json({ err: true, message: "something Wrong", reason: error })
        }
    },
    getAllLessonsByCourse: async (req, res) => {
        try {
            const lessons = await Lesson.find({ course: req.params.id }).select("-video")
            if (!lessons) return res.status(404).json({ err: true, message: 'lessons not found under this course' })
            return res.status(200).json({ message: "lessons fetched succesfully", data: lessons })
        } catch (error) {
            return res.status(500).json({ err: true, message: "operation failed ", reason: error })
        }
    },
    getAllLessonsByCourseId: async (req, res) => {
        try {
            const lessons = await Lesson.find({ course: req.params.id }).select("-video")
            if (!lessons.length) return res.status(404).json({ err: true, message: 'no lesson found under this course' })
            return res.status(200).json({ message: "lessons fetched succesfully", data: lessons })
        } catch (error) {
            return res.status(500).json({ err: true, message: "operation failed ", reason: error })
        }
    },
    getVideo: async (req, res) => {
        try {
            const lessonId = req.query.id
            const lesson = await Lesson.findOne({ _id: lessonId })
            if (!lesson) return res.status(404).json({ err: true, message: "No Lesson found" })
            const s3ObjectUrl = parseUrl(lesson.video);
            const presigner = new S3RequestPresigner({
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                },
                region: "us-west-2",
                sha256: Hash.bind(null, "sha256"),
            });
            const url = await presigner.presign(new HttpRequest(s3ObjectUrl));
            return res.status(200).json({ message: "video fetched succesfully", data: formatUrl(url) })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ err: true, message: "operation failed ", reason: error })
        }
    }
}
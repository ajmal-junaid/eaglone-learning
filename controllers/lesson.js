const Lesson = require('../models/lesson');

module.exports = {
    isLessonExists: async (lessonId) => {
        return await Lesson.find({ lessonId: lessonId }).count > 0;
    },
    addLesson: async (req, res) => {
        console.log(req.body);
        try {
            let { lessonId, title, tutorName, course } = req.body;
            if (!lessonId || !title || !tutorName || !course) return res.status(422).json({ err: true, message: "Enter all required fields" })
            req.body.lessonId = lessonId.toLowerCase()
            const lesson = Lesson.findOne({ lessonId: req.body.lessonId }).count>0
            console.log(lesson);
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
            const { lessonId } = req.query;
            const lesson = Lesson.findOne({ lessonId: lessonId })
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
    }
}
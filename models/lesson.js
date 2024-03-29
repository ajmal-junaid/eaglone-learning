const connection = require('../utils/database')

const lessonSchema = {
  lessonId: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  tutorName: {
    type: String,
    required: false,
  },
  video: {
    type: String,
    required: false,
  },
}

const Lesson = connection.model('Lesson', lessonSchema)
module.exports = Lesson

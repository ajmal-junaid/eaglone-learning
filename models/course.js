const mongoose = require('mongoose')
const connection = require('../utils/database')

const ratingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
)

const courseSchema = {
  title: {
    type: String,
    required: true,
  },
  courseId: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  classes: {
    type: Number,
    required: false,
  },
  views: {
    type: Number,
    required: false,
  },
  price: {
    type: Number,
    required: false,
  },
  percentage: {
    type: Number,
    required: false,
  },
  ourPrice: {
    type: Number,
    required: false,
  },
  category: {
    type: String,
    required: false,
  },
  premium: {
    type: Boolean,
    required: true,
  },
  rating: [ratingSchema],
}

const Course = connection.model('Course', courseSchema)
module.exports = Course

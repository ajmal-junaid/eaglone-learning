const Category = require('../models/category')
const { isAnyCourse } = require('./course')

module.exports = {
  addCategory: async (req, res) => {
    try {
      let { name, description } = req.body
      if (!name || !description)
        return res
          .status(206)
          .json({ err: true, message: 'Enter all required fields' })
      req.body.name = name.toUpperCase()
      const category = await Category.findOne({ name: req.body.name })
      if (category)
        return res
          .status(208)
          .json({ err: true, message: 'Category Already Exists' })
      const imageUrl = req.file
        ? `https://${process.env.AWS_S3_BUCKET_PUBLIC}.s3.amazonaws.com/${req.file.key}`
        : null
      req.body.image = imageUrl
      req.body.coursecount = 0
      const success = await Category.create(req.body)
      if (success)
        return res.status(201).json({ message: 'Category Added Succesfully' })
      return res
        .status(201)
        .json({ err: true, message: 'Category Creation Failed' })
    } catch (error) {
      console.log(error)
      return res
        .status(212)
        .json({ err: true, message: 'something Wrong', reason: error })
    }
  },

  getCategory: async (req, res) => {
    try {
      const categories = await Category.find()
      if (!categories)
        return res
          .status(204)
          .json({ err: true, message: 'No categories found' })

      return res
        .status(200)
        .json({ message: 'Categories fetched Successfully', data: categories })
    } catch (error) {
      return res
        .status(212)
        .json({ err: true, message: 'something Wrong', reason: error })
    }
  },
  getCategoryById: async (req, res) => {
    try {
      const category = await Category.findOne({ _id: req.params.id })
      if (!category)
        return res.status(204).json({ err: true, message: 'No category found' })
      return res
        .status(200)
        .json({ message: 'Category fetched Successfully', data: category })
    } catch (error) {
      return res
        .status(212)
        .json({ err: true, message: 'something Wrong', reason: error })
    }
  },
  updateCategory: async (req, res) => {
    try {
      const category = await Category.findOne({ _id: req.params.id })
      if (!category)
        return res.status(204).json({ err: true, message: 'No category found' })
      const imageUrl = req.file
        ? `https://${process.env.AWS_S3_BUCKET_PUBLIC}.s3.amazonaws.com/${req.file.key}`
        : category.image
      req.body.image = imageUrl

      const result = await Category.updateOne(
        { _id: req.params.id },
        { $set: req.body }
      )
      return res
        .status(202)
        .json({ message: 'Category updated Successfully', data: result })
    } catch (error) {
      return res
        .status(212)
        .json({ err: true, message: 'something Wrong', reason: error })
    }
  },
  deleteCategoryById: async (req, res) => {
    try {
      let course = await isAnyCourse(req.params.id)
      if (course)
        return res.status(211).json({
          err: true,
          message: 'Course Exists,Remove Course and Try Again..!',
        })
      else {
        const result = await Category.deleteOne({ name: req.params.id })
        return res
          .status(202)
          .json({ message: 'Category deleted Successfully', data: result })
      }
    } catch (error) {
      return res
        .status(212)
        .json({ err: true, message: 'something Wrong', reason: error })
    }
  },
  getCategoryByName: async (req, res) => {
    try {
      const category = await Category.findOne({ name: req.params.id })
      if (!category)
        return res.status(404).json({ err: true, message: 'No category found' })
      return res
        .status(200)
        .json({ message: 'Category fetched Successfully', data: category })
    } catch (error) {
      return res
        .status(500)
        .json({ err: true, message: 'something Wrong', reason: error })
    }
  },
}

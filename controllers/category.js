const Category = require('../models/category');
const { isAnyCourse } = require('./course');
let objectId = require('mongodb').ObjectId;

module.exports = {
    addCategory: async (req, res) => {
        try {
            let { name, description } = req.body;
            if (!name || !description) return res.status(206).json({ err: true, message: "Enter all required fields" })
            req.body.name = name.toUpperCase();
            const category = await Category.findOne({ name: req.body.name })
            if (category) return res.status(208).json({ err: true, message: "Category Already Exists" })
            const imageUrl = req.file ? `/images/${req.file.filename}` : null;
            req.body.image = imageUrl;
            req.body.coursecount = 0;
            const success = await Category.create(req.body)
            console.log(success);
            if (success) return res.status(201).json({ message: "Category Added Succesfully" })
            return res.status(201).json({ err: true, message: "Category Creation Failed" })
        } catch (error) {
            return res.status(212).json({ err: true, message: "something Wrong", reason: error })
        }
    },

    getCategory: async (req, res) => {
        try {
            const categories = await Category.find();
            if (!categories) return res.status(204).json({ err: true, message: "No categories found" })
            return res.status(200).json({ message: "Categories fetched Successfully", data: categories })
        } catch (error) {
            return res.status(212).json({ err: true, message: "something Wrong", reason: error })
        }
    },
    getCategoryById: async (req, res) => {
        try {
            const category = await Category.findOne({ _id: req.params.id })
            if (!category) return res.status(204).json({ err: true, message: "No category found" })
            return res.status(200).json({ message: "Category fetched Successfully", data: category })
        } catch (error) {
            return res.status(212).json({ err: true, message: "something Wrong", reason: error })
        }
    },
    updateCategoryById: async (req, res) => {
        try {
            const category = await Category.findOne({ _id: req.params.id })
            if (!category) return res.status(204).json({ err: true, message: "No category found" })
            
            if (req.file!=undefined) {
                const imageUrl = req.file ? `/images/${req.file.filename}` : null;
                req.body.image = imageUrl;
            }else{
                req.body.image =category.image;
            }
            const result = await Category.updateOne(
                { _id: req.params.id },
                { $set: req.body }
            )
            return res.status(202).json({ message: "Category fetched Successfully", data: result })
        } catch (error) {
            return res.status(212).json({ err: true, message: "something Wrong", reason: error })
        }
    },
    deleteCategoryById:async (req,res)=>{
        try {
            let course=await isAnyCourse(req.params.id)
            if(course) return res.status(211).json({err:true, message: "Course Exists,Remove Course and Try Again..!" })
            else {
                const result = await Category.deleteOne({ name: req.params.id })
                return res.status(202).json({ message: "Category deleted Successfully", data: result })
            }
        } catch (error) {
            return res.status(212).json({ err: true, message: "something Wrong", reason: error })
        }
    }
}

// node mailer
const Category = require('../models/category');
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
    }
}

// node mailer
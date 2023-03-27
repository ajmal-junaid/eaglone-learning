const User = require('../models/user')
const ObjectId = require("mongodb").ObjectId;
const mongoose = require('mongoose');
const Course = require('../models/course');

module.exports = {
    addToCart: async (req, res) => {
        const { courseId, userId } = req.body;
        if (!mongoose.isValidObjectId(courseId) || !mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ err: true, message: 'Invalid product ID or user ID' });
        }
        try {
            const result = await User.updateOne(
                { _id: userId, cart: { $ne: courseId } },
                { $addToSet: { cart: courseId } }
            );
            if (result.modifiedCount === 0) {
                res.status(400).json({ err: true, message: 'Product Already Exists in Cart' });
            } else {
                res.status(200).json({ err: false, message: 'Product Added to Cart' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ err: true, message: 'Something Went Wrong' });
        }
    },
    removeCourse: async (req, res) => {
        try {
            const { courseId, userId } = req.body;
            if (!mongoose.isValidObjectId(courseId) || !mongoose.isValidObjectId(userId)) {
                return res.status(400).json({ err: true, message: 'Invalid product ID or user ID' });
            }
            const result = await User.findByIdAndUpdate(userId, { $pull: { cart: courseId } });
            if (!result) {
                return res.status(404).json({ err: true, message: 'User Not Found' });
            }
            if (!result.cart.includes(courseId)) {
                return res.status(400).json({ err: true, message: 'Product Not Found in Cart' });
            }
            res.status(200).json({ err: false, message: 'Product Removed from Cart' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ err: true, message: 'Something Went Wrong' });
        }

    },
    getCartCourses: async (req, res) => {
        try {
            const { userId } = req.query;
            if (!mongoose.isValidObjectId(userId)) {
                return res.status(400).json({ err: true, message: 'Invalid user ID' });
            }
            const user = await User.findById(userId).populate({
                path: 'cart',
                model: 'Course'
            });
            if (!user) {
                return res.status(404).json({ err: true, message: 'User Not Found' });
            }
            const cart = user.cart;
            if (!cart.length > 0) return res.status(404).json({ err: true, message: 'Cart is empty' });
            const cartDetails = cart.map(course => ({
                _id: course._id,
                title: course.title,
                category: course.category,
                image: course.image,
                ourPrice: course.ourPrice,
                price: course.price,
                percentage: course.percentage,
                premium: course.premium
            }));
            res.status(200).json({ err: false, data: cartDetails });
        } catch (error) {
            console.log(error);
            res.status(500).json({ err: true, message: 'Something Went Wrong' });
        }
    }




}
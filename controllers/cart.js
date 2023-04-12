const User = require('../models/user')
const mongoose = require('mongoose');

module.exports = {
    addToCart: async (req, res) => {
        try {
            const { courseId, userId } = req.body;
            if (!mongoose.isValidObjectId(courseId) || !mongoose.isValidObjectId(userId)) {
                return res.status(400).json({ err: true, message: 'Invalid product ID or user ID' });
            }
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ err: true, message: 'User Not found' });
            }
            if (user.coursesPurchased.includes(courseId)) {
                return res.status(400).json({err:true, message: "Course already purchased" });
            }
            const result = await User.updateOne(
                { _id: userId, cart: { $ne: courseId } },
                { $addToSet: { cart: courseId } }
            );
            if (result.modifiedCount === 0) {
                res.status(400).json({ err: true, message: 'Course Already Exists in Cart' });
            } else {
                res.status(200).json({ err: false, message: 'Course Added to Cart' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ err: true, message: 'Something Went Wrong' });
        }
    },
    addFreeCourse: async (req, res) => {
        try {
            const { courseId, userId } = req.body;
            if (!mongoose.isValidObjectId(courseId) || !mongoose.isValidObjectId(userId)) {
                return res.status(400).json({ err: true, message: 'Invalid course ID or user ID' });
            }
            const result = await User.updateOne(
                { _id: userId, coursesPurchased: { $ne: courseId } },
                { $addToSet: { coursesPurchased: courseId } }
            );
            if (result.modifiedCount === 0) {
                res.status(400).json({ err: true, message: 'Course Already Enrolled' });
            } else {
                res.status(200).json({ err: false, message: 'Course Added Successfull' });
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
                return res.status(400).json({ err: true, message: 'Invalid user ID',data:[] });
            }
            const user = await User.findById(userId).populate({
                path: 'cart',
                model: 'Course'
            });
            if (!user) {
                return res.status(404).json({ err: true, message: 'User Not Found',data:[] });
            }
            const cart = user.cart;
            if (!cart.length > 0) return res.status(404).json({ err: true, message: 'Cart is empty',data:[] });
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
            res.status(200).json({ err: false, data: cartDetails ,message: 'Cart fetched successfully' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ err: true, message: 'Something Went Wrong',data:[] });
        }
    }




}
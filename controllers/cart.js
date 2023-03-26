const User = require('../models/user')
const ObjectId = require("mongodb").ObjectId;
const mongoose = require('mongoose');

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
            res.status(500).json({ err: true, message: 'Internal Server Error' });
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
            res.status(500).json({ err: true, message: 'Internal Server Error' });
        }

    }



}
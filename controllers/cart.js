const User = require('../models/user')
const ObjectId = require("mongodb").ObjectId;
const mongoose = require('mongoose');

module.exports = {
    addToCart: async (req, res) => {
        const { productId, userId } = req.body;
        if (!mongoose.isValidObjectId(productId) || !mongoose.isValidObjectId(userId)) {
            return res.status(400).json({err:true,message:'Invalid product ID or user ID'});
        }
        try {
            const result = await User.updateOne(
                { _id: userId, cart: { $ne: productId } },
                { $addToSet: { cart: productId } }
            );
            if (result.modifiedCount === 0) {
                res.status(400).json({err:true,message:'Product Already Exists in Cart'});
            } else {
                res.status(200).json({err:false,message:'Product Added to Cart'});
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({err:true,message:'Internal Server Error'});
        }
    },
    removeCourse: async (req, res) => {
        try {
            const { user, _id } = req.body;
            const deleteCourse = await User.findOneAndUpdate(
                {
                    _id: ObjectId(user),
                },
                {
                    $pull: { cart: { _id: _id } },
                }
            );
            if (deleteCourse) {
                const userData = await User.findOne({ _id: ObjectId(user) });
                return res.status(200).json({ message: "Course Removed", userData })
            }

        } catch (error) {
            return res.status(500).json({ err: true, message: "Something went wrong", reason: error })
        }
    }



}
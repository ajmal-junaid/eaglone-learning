const User = require('../models/user')
const ObjectId = require("mongodb").ObjectId;

module.exports = {
    addToCart: async (req, res) => {
        try {
            const data = req.body
            const courseExists = await User.findOne({
                _id: ObjectId(data.user),
                cart: { $elemMatch: { _id: data._id } }
            })
            if (courseExists) {
                const updateCount = await User.findOneandUpdate(
                    {
                        _id: ObjectId(data.user),
                        cart: { $elemMatch: { _id: data._id } }
                    },
                    {
                        $inc: { "cart.$.count": data.count }
                    }
                );
                const userData = await User.findOne({ _id: ObjectId(data.user) })
                return res.status(200).json({ message: "Cart Updated", userData })
            }
            const addCourse = await User.findOneAndUpdate(
                { _id: ObjectId(data.user) },
                { $push: { cart: data } }
            );
            const userData = await User.findOne({ _id: ObjectId(data.user) })
            return res.status(200).json({ message: "New Course Added", userData })
        } catch (error) {
            return res.status(500).json({ err: true, message: "something went wrong", error })
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
            return res.status(500).json({ err: true, message: "Something went wrong",reason:error})
        }
    }



}
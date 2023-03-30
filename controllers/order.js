const mongoose=require('mongoose');
const Order = require('../models/order');
const Course = require('../models/course');
const User = require('../models/user');
const Stripe  = require('stripe')(process.env.SECRET_KEY)

module.exports = {
    createOrder: async (req, res) => {
        try {
            const { user, courses, payment, coupon } = req.body;
            if (!mongoose.isValidObjectId(user)) {
                return res.status(400).json({ err: true, message: 'User ID' });
            }
            const userCoursesPurchased = await User.findById(user).select('coursesPurchased')
            const purchasedCourseIds = userCoursesPurchased.coursesPurchased.map(course => course.toString());
            if (purchasedCourseIds.length) {
                const coursesToPurchase = courses.filter(course => !purchasedCourseIds.includes(course.toString()));
                if (coursesToPurchase.length === 0) {
                    return res.status(400).json({err:true, message: 'User has already purchased All these courses' });
                } else {
                    return res.status(400).json({err:true, message: 'Already purchased some of these courses' });
                }
            }
            const courseDocuments = await Course.find({ _id: { $in: courses } });
            if (!courseDocuments) return res.status(400).json({ err:true, message: 'Courses is removed or expired (not found)' });
            await User.findByIdAndUpdate(user, { $addToSet: { coursesPurchased: { $each: courses } } }, { new: true })
            const order = new Order({
                user: user,
                coupon: coupon,
                courses: courseDocuments.map(course => ({ course: course._id, price: course.ourPrice })),
                payment: {
                    method: payment.method,
                    transactionId: payment.transactionId,
                    amount: courseDocuments.reduce((acc, curr) => {
                        if (curr.ourPrice) {
                            return acc + curr.ourPrice;
                        }
                        return acc + curr.price;
                    }, 0),
                },
                coupon: coupon
            });
            res.status(201).json({err:false,message:"order placed successfully ",data: order });
        } catch (err) {
            console.error(err);
            res.status(500).json({err:true, message: 'Internal server error' });
        }
    },
    payment:async(req,res)=>{
        let status,error;
        const {token,amount}=req.body;
        console.log(token, amount);
        try {
            await Stripe.charges.create({
                source:token.id,
                amount,
                currency:'usd'
            })
            status='success'
        } catch (error) {
            console.log(error);
            status="failed"
        }
        res.status(200).json({err:false,message:"payment successfull",status})
    }
}



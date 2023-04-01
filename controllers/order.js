const mongoose = require('mongoose');
const Order = require('../models/order');
const Course = require('../models/course');
const User = require('../models/user');
const Stripe = require('stripe')(process.env.SECRET_KEY)

module.exports = {
    createOrder: async (req, res) => {
        console.log(req.body, "body daaaaaaaaaa");
        try {
            const { user, courses, payment, coupon, client } = req.body;
            if (!mongoose.isValidObjectId(user)) {
                return res.status(400).json({ err: true, message: 'User ID' });
            }
            const userCoursesPurchased = await User.findById(user).select('coursesPurchased')
            const purchasedCourseIds = userCoursesPurchased.coursesPurchased.map(course => course.toString());
            if (purchasedCourseIds.length) {
                const coursesToPurchase = courses.filter(course => !purchasedCourseIds.includes(course.toString()));
                if (coursesToPurchase.length === 0) {
                    return res.status(400).json({ err: true, message: 'User has already purchased All these courses' });
                } else {
                    return res.status(400).json({ err: true, message: 'Already purchased some of these courses' });
                }
            }
            const courseDocuments = await Course.find({ _id: { $in: courses } });
            if (!courseDocuments) return res.status(400).json({ err: true, message: 'Courses is removed or expired (not found)' });
            // await User.findByIdAndUpdate(user, { $addToSet: { coursesPurchased: { $each: courses } } }, { new: true })
            Order.create({
                user: user,
                coupon: coupon,
                client: client,
                courses: courseDocuments.map(course => ({ course: course._id, price: course.ourPrice })),
                payment: {
                    method: payment?.method,
                    transactionId: payment?.transactionId,
                    amount: courseDocuments.reduce((acc, curr) => {
                        if (curr.ourPrice) {
                            return acc + curr.ourPrice;
                        }
                        return acc + curr.price;
                    }, 0),
                }
            }).then((order) => {
                res.status(201).json({ err: false, message: "order placed successfully ", data: order });
            }).catch((err) => {
                res.status(201).json({ err: true, message: "order failed", data: err });
            })
        } catch (err) {
            console.error(err);
            res.status(500).json({ err: true, message: 'Internal server error' });
        }
    },
    payment: async (req, res) => {
        let status, error;
        const { amount } = req.body;
        console.log(amount);
        try {
            const paymentIntent = await Stripe.paymentIntents.create({
                amount: amount,
                currency: "inr",
                automatic_payment_methods: {
                    enabled: true,
                },
            });
            status = 'success'
            res.status(200).json({ err: false, message: "payment successfull", status, clientSecret: paymentIntent.client_secret })
        } catch (error) {
            console.log(error);
            status = "failed"
            res.status(400).json({ err: true, message: "payment failed", status })
        }
    },
    verifyPayment: async (req, res) => {
        try {
            const { clientSecret, transactionId, status } = req.body;
            if (status === 'succeeded') {
                const order = await Order.findOne({ client: clientSecret })
                console.log(order,"clientSecret");
                const courses = order.courses.map(course => course.course)
                console.log(courses);
                await User.findByIdAndUpdate(order.user, {
                    $addToSet: {
                        coursesPurchased: { $each: courses },
                    },
                    $set: { cart: [] }
                }, { new: true })
                await Order.findByIdAndUpdate(order._id, {
                    $set: {
                        client: status,
                        payment: {
                            method: order.payment.method,
                            transactionId: transactionId,
                            amount: order.payment.amount
                        }
                    }
                })
                res.status(200).json({ err: false, message: "successfull" })
            }else{
                res.status(400).json({ err: true, message: "failed" })
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ err: true, message: "payment failed , if money debited, contact us", error })
        }
    },
    getOrders:async (req,res)=>{
        try {
            const userId = req.params.id;
            const orders = await Order.find({user:userId})
            if(!orders) return res.status(404).json({err:true,message:"no orders found on this user"})
            return res.status(200).json({err:false,message:"orders fetched" , data:orders})
        } catch (error) {
            res.status(500).json({ err: true, message: "Something went wrong", error })
        }
    },
    getAllOrders:async(req,res)=>{
        try {
            const orders = await Order.find().sort({ createdAt: -1 })
            if(!orders) return res.status(404).json({err:true,message:"no orders found in Db"})
            return res.status(200).json({err:false,message:"orders fetched" , data:orders})
        } catch (error) {
            res.status(500).json({ err: true, message: "Something went wrong", error })
        }
    }
}



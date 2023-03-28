const Order = require('../models/order');
const Course = require('../models/course');
const User = require('../models/user');

module.exports = {
    createOrder: async (req, res) => {
        try {
            const { user, courses, payment, coupon } = req.body;
            const userCoursesPurchased = await User.findById(user).select('coursesPurchased');
            console.log(userCoursesPurchased, "firtttt");
            const purchasedCourseIds = userCoursesPurchased.coursesPurchased.map(course => course.toString());
            console.log(purchasedCourseIds, "purchasedCourseIds");

            const coursesToPurchase = courses.filter(course => !purchasedCourseIds.includes(course.course.toString()));
            if (coursesToPurchase.length === 0) {
                return res.status(400).json({ error: 'User has already purchased these courses' });
            }
            const courseDocuments = await Course.find({ _id: { $in: coursesToPurchase } });
            const order = new Order({
                user: user,
                courses: courseDocuments.map(course => ({ course: course._id, price: course.ourPrice })),
                payment: {
                    method: payment.method,
                    transactionId: payment.transactionId,
                    amount: courseDocuments.reduce((acc, curr) => {
                        if (curr.ourPrice) {
                            return acc + curr.ourPrice;
                        }
                        return acc + curr.price;
                    }, 0)
                }
            });
            const newOrder = await order.save();
            res.status(201).json(newOrder);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}


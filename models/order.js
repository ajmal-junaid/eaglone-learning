const mongoose = require('mongoose');
const connection = require('../utils/database');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    client: {
        type: String,
        required: false
    },
    courses: [{
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
        price: { type: Number, required: true }
    }],
    coupon: {
        type: {
            code: { type: String, required: false },
            discount: { type: Number, required: false }
        },
        default: null
    },
    payment: {
        type: {
            method: { type: String, required: false },
            transactionId: { type: String, required: false },
            amount: { type: Number, required: false }
        },
        required: false
    },
    createdAt: { type: Date, default: Date.now },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// setInterval(async () => {
//     const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
//     const unpaidOrders = await Order.find({
//       payment: { $exists: false },
//       createdAt: { $lt: tenMinutesAgo }
//     });
//     await Order.deleteMany({ _id: { $in: unpaidOrders.map(order => order._id) } });
//   }, 5 * 60 * 1000);

orderSchema.virtual('totalAmount').get(function () {
    return this.payment.amount - (this.coupon ? this.coupon.discount : 0);
});

const Order = connection.model("Order", orderSchema)
module.exports = Order;
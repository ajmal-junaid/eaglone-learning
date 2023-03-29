const mongoose = require('mongoose');
const connection = require('../utils/database');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courses: [{
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
        price: { type: Number, required: true }
    }],
    coupon: {
        type: {
            code: { type: String, required: true },
            discount: { type: Number, required: true }
        },
        default: null
    },
    payment: {
        type: {
            method: { type: String, required: false },
            transactionId: { type: String, required: false },
            amount: { type: Number, required: false }
        },
        required: true
    },
    createdAt: { type: Date, default: Date.now },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

orderSchema.virtual('totalAmount').get(function () {
    return this.payment.amount - (this.coupon ? this.coupon.discount : 0);
});

const Order = connection.model("Order", orderSchema)
module.exports = Order;
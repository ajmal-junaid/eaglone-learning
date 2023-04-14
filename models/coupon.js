const connection = require('../utils/database');

const couponSchema = ({
    code: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    minimumPurchase: {
        type: Number,
        required: true
    },
    maximumDiscount: {
        type: Number,
        required: true
    },
    limit: {
        type: Number,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    },
    createdAt: { type: Date,
     default: Date.now 
    }
})

const Coupon = connection.model('Coupon',couponSchema);
module.exports = Coupon;
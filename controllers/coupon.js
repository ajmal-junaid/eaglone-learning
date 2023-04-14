const Coupon = require('../models/coupon')
const mongoose = require('mongoose')

module.exports = {
  addCoupon: async (req, res) => {
    try {
      const {
        code,
        name,
        expiryDate,
        minimumPurchase,
        maximumDiscount,
        limit,
        percentage,
      } = req.body
      if (
        !code ||
        !name ||
        !expiryDate ||
        !minimumPurchase ||
        !maximumDiscount ||
        !limit ||
        !percentage
      ) {
        return res.status(400).json({ error: 'Missing required fields' })
      }
      const existingCoupon = await Coupon.findOne({ code })
      if (existingCoupon) {
        return res.status(409).json({
          err: true,
          message: 'Coupon with the same code is already exists',
        })
      }
      const newCoupon = new Coupon({
        code,
        name,
        expiryDate,
        minimumPurchase,
        maximumDiscount,
        limit,
        percentage,
      })
      await newCoupon.save()
      res.status(200).json({ err: false, message: 'Coupon added successfully' })
    } catch (error) {
      res.status(500).json({ err: true, message: error.message })
    }
  },
  deleteCoupon: async (req, res) => {
    try {
      const id = req.params.id
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ err: true, message: 'Invalid coupon ID' })
      }
      const deletedCoupon = await Coupon.findByIdAndDelete(id)
      if (!deletedCoupon) {
        return res.status(404).json({ err: true, message: 'Coupon not found' })
      }
      res
        .status(200)
        .json({ err: false, message: 'Coupon deleted successfully' })
    } catch (error) {
      console.error('Error deleting coupon:', error)
      res.status(500).json({ err: true, message: 'Internal server error' })
    }
  },
  getAllCoupons: async (req, res) => {
    try {
      const Coupons = await Coupon.find()
      if (!Coupons.length) {
        return res.status(404).json({ err: true, message: 'Coupon not found' })
      }
      res.status(200).json({
        err: false,
        message: 'Coupon fetched successfully',
        data: Coupons,
      })
    } catch (error) {
      console.error('Error fetching coupon:', error)
      res.status(500).json({ err: true, message: 'Internal server error' })
    }
  },
  applyCoupon: async (req, res) => {
    try {
      const coupon = await Coupon.findOne({
        code: req.body.code,
        expiryDate: { $gte: new Date() },
      })
      if (!coupon) {
        return res
          .status(400)
          .json({ err: true, message: 'Coupon Code is invalid or expired' })
      }
      if (req.body.totalAmount < coupon.minimumPurchase) {
        return res.status(400).json({
          err: true,
          message: `Minimum purchase amount of ${coupon.minimumPurchase} is required to use this coupon.`,
        })
      }
      if (coupon.limit <= 0) {
        return res
          .status(400)
          .json({ err: true, message: 'Coupon usage limit has been reached.' })
      }
      const discountAmount = Math.min(
        (req.body.totalAmount * coupon.percentage) / 100,
        coupon.maximumDiscount
      )
      coupon.limit--
      await coupon.save()
      return res.status(200).json({
        err: false,
        message: `${coupon.code} applied successfully (upto ${coupon.maximumDiscount} off)`,
        data: discountAmount,
      })
    } catch (error) {
      res.status(500).json({ err: true, message: 'Something Went Wrong' })
    }
  },
}

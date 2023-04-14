const Banner = require('../models/banner')

module.exports = {
  getBanner: async (req, res) => {
    try {
      const banners = await Banner.find()
      res.status(200).json({ err: false, data: banners })
    } catch (err) {
      console.error(err)
      res.status(500).json({ err: true, message: 'Server Error' })
    }
  },
  addBanner: async (req, res) => {
    try {
      const imageUrl = req.file
        ? `https://${process.env.AWS_S3_BUCKET_PUBLIC}.s3.amazonaws.com/${req.file.key}`
        : null
      const newBanner = new Banner({ image: imageUrl })
      await newBanner.save()
      res.status(201).json({ err: false, message: 'Banner Added successfully' })
    } catch (err) {
      console.error(err)
      res.status(500).json({ err: true, message: 'Server Error' })
    }
  },
  deleteBanner: async (req, res) => {
    try {
      const banner = await Banner.findOne({ _id: req.params.id })
      if (!banner)
        return res.status(404).json({ err: true, message: 'banner not found' })
      const result = await Banner.deleteOne({ _id: req.params.id })
      return res.status(202).json({
        err: false,
        message: 'Banner deleted Successfully',
        data: result,
      })
    } catch (error) {
      res.status(500).json({ err: true, message: 'Server Error', error })
    }
  },
}

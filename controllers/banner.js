const Banner = require('../models/banner')

module.exports = {
    getBanner: async (req, res) => {
        try {
            const banners = await Banner.find();
            res.status(200).json({ err: false, data: banners });
        } catch (err) {
            console.error(err);
            res.status(500).json({ err: true, message: 'Server Error' });
        }
    },
    addBanner: async (req, res) => {
        console.log("yess");
        try {
            const newBanner = new Banner(req.body);
            const savedBanner = await newBanner.save();
            res.status(201).json({ err: false, data: savedBanner });
        } catch (err) {
            console.error(err);
            res.status(500).json({ err: true, message: 'Server Error' });
        }
    }
}
const mongoose = require('mongoose');
const connection = require("../utils/database");

const bannerSchema = new mongoose.Schema({
    name: { 
        type: String, 
        default: function() {
            return 'Banner ' + Date.now();
        }
    },
    image:{
        type:String,
        required:true
    },
    createdAt: { type: Date, default: Date.now },
    
    
})

const Banner = connection.model("Banner",bannerSchema)
module.exports = Banner;

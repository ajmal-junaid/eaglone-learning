const mongoose=require('mongoose');
const connection = require('../utils/database');

const cartSchema=({
    user:{
        type:String,
        required:true
    },
    courses:{
        type:Array
    }
})

const Cart = connection.model('Cart',cartSchema);
module.exports =Cart;
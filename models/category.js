const connection = require('../utils/database');

const categorySchema=({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:false
    },
    image:{
        type:String,
        required:false
    },
    coursecount:{
        type:Number,
        required:true
    }
})

const Category = connection.model('Category',categorySchema);
module.exports = Category

const mongoose = require('mongoose');
const connection = require('../utils/database');

const courseSchema=({
    title:{
        type:String,
        required:true
    },
    courseId:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:false
    },
    description:{
        type:String,
        required:false 
    },
    classes:{
        type:Number,
        required:false
    },
    views:{
        type:Number,
        required:false
    },
    category:{
        type:String,
        required:false
    },
    premium:{
        type:Boolean,
        required:true
    },
    rating:{
        type:Number,
        required:false
    }
})

const Course = connection.model('Course',courseSchema);
module.exports = Course

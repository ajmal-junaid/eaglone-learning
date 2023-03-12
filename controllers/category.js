const Category = require('../models/category');
let objectId = require('mongodb').ObjectId;

module.exports = {
    addCategory: async (req, res) => {
        try{
            let { name, description } = req.body;
            const imageUrl = req.file ? `/images/${req.file.filename}` : null;
            name=name.toUpperCase();
    
            
            console.log("Received category name:", name);
            console.log("Received description:", description);
            console.log("Received image URL:", imageUrl);
        
        
            res.send("Category added successfully");
        }catch(err){

        }
    },

    getCategory: async (req,res)=>{

    }
}

// node mailer
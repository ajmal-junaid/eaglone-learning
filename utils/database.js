const mongoose = require('mongoose') 
//const connection = mongoose.createConnection("mongodb://localhost:27017/zetetikoz");
const connection = mongoose.createConnection("mongodb+srv://learning-project:cA6JdrkFk82xdKH@atlascluster.nsktbgw.mongodb.net/learning");
//mongodb+srv://zetetikoz:Zetetik0z@zetetikoz-ecommerce.xczbn.mongodb.net/zetetikoz
module.exports=connection;
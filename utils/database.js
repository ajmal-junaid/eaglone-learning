const mongoose = require('mongoose');
const connection = mongoose.createConnection("mongodb+srv://learning-project:cA6JdrkFk82xdKH@atlascluster.nsktbgw.mongodb.net/learning")
module.exports = connection;
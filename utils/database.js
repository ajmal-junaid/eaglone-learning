const mongoose = require('mongoose')
const connection = mongoose.createConnection(process.env.MONGO_URI_LEARNING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
module.exports = connection

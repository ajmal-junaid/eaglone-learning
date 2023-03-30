const express = require('express')
const cors = require('cors')
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
require('dotenv').config();
const userRoutes = require('./routes/user')
const adminRoutes = require('./routes/admin')
const { verifyApiKey } = require('./middlewares/verifications')
app.use(verifyApiKey)
app.use('/', userRoutes)
app.use('/admin', adminRoutes)
process.setMaxListeners(15); // (node:16026) MaxListenersExceededWarning to avoid this err
//app.listen(3000, '192.168.64.140'); //space ip
app.listen(3000,error=>{
    if(error) console.log(error,"connection failed")
    console.log("server is running on Port 3000");
}); 

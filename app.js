const express = require('express')
const cors = require('cors')
const app = express();
app.use(express.json());
require('dotenv').config();
app.use(cors());     //middleware
const userRoutes = require('./routes/user')
const adminRoutes = require('./routes/admin')
const {verifyApiKey} = require('./middlewares/verifications')
app.use(verifyApiKey)
app.use('/',userRoutes)
app.use('/admin',adminRoutes)
//app.listen(3000,'192.168.65.229');
app.listen(3000);
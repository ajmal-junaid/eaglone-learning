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
app.use('/', userRoutes)
app.use('/admin', adminRoutes)
app.listen(3000, '192.168.52.174'); //space ip
// app.listen(3000, '192.168.91.60'); //mobile ip
//app.listen(3000); 

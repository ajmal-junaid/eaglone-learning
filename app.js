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
//app.use(verifyApiKey)

app.use('/', userRoutes)
app.use('/admin', adminRoutes)
app.listen(3000, '192.168.48.218');
//app.listen(3000);
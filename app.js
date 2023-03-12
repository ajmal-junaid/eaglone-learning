const express = require('express')
const cors = require('cors')
// const bodyParser = require("body-parser");
const app = express();
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());     //middleware
require('dotenv').config();
const userRoutes = require('./routes/user')
const adminRoutes = require('./routes/admin')
const { verifyApiKey } = require('./middlewares/verifications')
//app.use(verifyApiKey)

app.use('/', userRoutes)
app.use('/admin', adminRoutes)
app.listen(3000, '192.168.29.140');
//app.listen(3000);
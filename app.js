const express = require('express')
const cors = require('cors')

const app = express();
app.use(express.json());
require('dotenv').config();
app.use(cors());     //middleware
const userRoutes = require('./routes/user')
const adminRoutes = require('./routes/admin')


app.use('/',userRoutes)
app.use('/admin',adminRoutes)
app.listen(3000);
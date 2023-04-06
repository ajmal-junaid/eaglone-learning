const express = require('express')
const cors = require('cors')
const morgan = require('morgan');
const app = express();
const http = require('http')
const { Server } = require('socket.io')
const server = http.createServer(app);
const { initializeSocket } = require('./utils/socket');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));
require('dotenv').config();

initializeSocket(server);

const userRoutes = require('./routes/user')
const adminRoutes = require('./routes/admin')
const { verifyApiKey } = require('./middlewares/verifications')
app.use(verifyApiKey)
app.use('/', userRoutes)
app.use('/admin', adminRoutes)
process.setMaxListeners(15); // (node:16026) MaxListenersExceededWarning to avoid this err
//app.listen(3000, '192.168.64.140'); //space ip
server.listen(3000, error => {
    if (error) console.log(error, "connection failed")
    console.log("server is running on Port 3000");
});



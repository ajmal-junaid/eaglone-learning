const express = require('express')
const cors = require('cors')
const morgan = require('morgan');
const app = express();
const http = require('http')
const server = http.createServer(app);
require('dotenv').config();
const { initializeSocket } = require('./utils/socket');
const PORT = 4000
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('combined'));

initializeSocket(server);

const userRoutes = require('./routes/user')
const adminRoutes = require('./routes/admin')
app.get('/', function(req, res) {
    res.status(200).json({message:'Server is working fine !!!'});
  });
const { verifyApiKey } = require('./middlewares/verifications')
app.use(verifyApiKey)
app.use('/api/v1', userRoutes)
app.use('/api/v1/admin', adminRoutes)
process.setMaxListeners(15); // (node:16026) MaxListenersExceededWarning to avoid this err
server.listen(PORT, error => {
    if (error) console.log(error, "connection failed")
    console.log(`server is running on Port ${PORT}`);
});



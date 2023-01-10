const express = require('express');
const router = express.Router();
const { verifyApiKey, verifyUser } = require('../middlewares/verifications')

router.post('/user-signup', verifyApiKey, verifyUser, (req, res) => {
    //console.log(req.body);
    //console.log(req.headers['user-token'], "tokennnn")

    res.send(req.body)
})








module.exports = router
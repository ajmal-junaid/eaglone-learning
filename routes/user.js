const express = require('express');
const router = express.Router();
const { verifyUser } = require('../middlewares/verifications')
const { userLogin, userSignup } = require('../controllers/user')

router.post('/user-signup', userSignup)

router.post('/user-login',userLogin)

router.get('/nandu', (req, res) => {
    res.status(200).json({ message: "podaaaaaaaaaaaaaaaaaaaaaaaaaaaa" })
})



module.exports = router
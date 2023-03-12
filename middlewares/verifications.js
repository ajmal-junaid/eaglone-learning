const bcrypt = require('bcrypt');
require('dotenv').config();
const Jwt = require('jsonwebtoken')

module.exports = {
    verifyApiKey: (req, res, next) => {
        try {
            let apikey = req.headers['apikey']
            if (apikey) {
                apikey = apikey.split(" ")[1]
                bcrypt.compare(process.env.VERIFY_KEY, apikey, function (error, result) {
                    if (error) {
                        console.log(process.env.JWT_TOKEN);
                        res.status(400).json({ err: true, message: "Unexpected Error on Hashing", reason: error })
                    }
                    if (result) {
                        next()
                    }
                })
            } else {
                res.status(400).json({ err: true, message: "API-KEY not found" })
            }
        } catch (errorr) {
            res.status(500).json({ err: true, message: "unexpected API-KEY", reason: errorr })
        }
    },

    verifyUser: (req, res, next) => {
        try {
            let token = req.headers['authorization']
            if (token) {
                token = token.split(" ")[1]
                Jwt.verify(token, process.env.JWT_TOKEN, (err, success) => {
                    if (err) {
                        res.status(400).json({ err: true, message: "User Not Authorized", err })
                    } else {
                        next()
                    }
                })
                console.log(token, "Gottttttttttttt");
            } else {
                res.status(400).json({ err: true, message: "Token not exists" })
            }
        } catch (error) {
            console.log(error);
            res.status(400).json({ err: true, message: "Unexpected errot",err:error })
        }
    }

}
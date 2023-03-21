const bcrypt = require('bcrypt');
require('dotenv').config();
const Jwt = require('jsonwebtoken')
const jwtKey = process.env.JWT_TOKEN

module.exports = {
    verifyApiKey: async (req, res, next) => {
        if (req.path === '/test') {
            next();
        }
        try {
            let apikey = await req.headers['apikey']
            if (apikey) {
                apikey = apikey.split(" ")[1]
                bcrypt.compare(process.env.VERIFY_KEY, apikey, (error, result) => {
                    if (error) {
                        console.log(process.env.JWT_TOKEN, error);
                        res.status(203).json({ err: true, message: "Wrong Api Key", error })
                    }
                    if (result) {
                        next()
                    }
                })
            } else {
                res.status(204).json({ err: true, message: "API-KEY not found" })
            }
        } catch (errorr) {
            res.status(203).json({ err: true, message: "unexpected API-KEY", reason: errorr })
        }
    },

    verifyUser: (req, res, next) => {
        try {
            let token = req.headers['authorization']
            if (token) {
                token = token.split(" ")[1]
                Jwt.verify(token, jwtKey, (err, decoded) => {
                    if (err) {
                        if (err.name === 'JsonWebTokenError') {
                            return res.status(401).json({ err: true, message: "Invalid Token", reason: err.name })
                        } else if (err.name === 'TokenExpiredError') {
                            return res.status(401).json({ err: true, message: "token has expired", reason: err.name })
                        } else {
                            return res.status(401).json({ err: true, message: "some other error occurred", reason: err })
                        }
                    } else {
                        next()
                    }
                })
            } else {
                res.status(200).json({ err: true, message: "Token not exists" })
            }
        } catch (error) {
            console.log(error);
            res.status(200).json({ err: true, message: "Unexpected errot", err: error })
        }
    }

}
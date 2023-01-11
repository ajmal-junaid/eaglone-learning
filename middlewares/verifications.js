const bcrypt = require('bcrypt');
require('dotenv').config();
module.exports = {
    verifyApiKey: (req, res, next) => {
        try {
            let apikey = req.headers['api-key']
            if (apikey) {
                apikey = apikey.split(" ")[1]
                bcrypt.compare(process.env.VERIFY_KEY, apikey, function (error, result) {
                    if (error) {
                        res.status(400).json({ err: true, message: "unexpected Error on Hashing", reason: error })
                    }
                    if (result) {
                        console.log("successs");
                        next()
                    } else {
                        res.status(400).json({ err: true, message: "Invalid API-KEY" });
                        console.log("err");
                    }
                });
            } else {
                res.status(400).json({ err: true, message: "API-KEY not found" })
            }
        } catch (errorr) {
            res.status(500).json({ err: true, message: "unexpected API-KEY", "reason": errorr })
        }
    },

    verifyUser: (req, res, next) => {
        let token = req.headers['user-token']
        if (token) {
            token = token.split(" ")[1]
            console.log(token, "Gottttttttttttt");
        }
        next()
    }

}

module.exports={
verifyApiKey:(req, res, next)=> {
    let apikey = req.headers['api-key']
    if (apikey) {
        apikey = apikey.split(" ")[1]
    }
    console.log(apikey);
    next()
},

verifyUser:(req, res, next)=> {
    let token = req.headers['user-token']
    if (token) {
        token = token.split(" ")[1]
        console.log(token, "Gottttttttttttt");
    }
    next()
}

}
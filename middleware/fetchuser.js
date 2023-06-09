var jwt = require('jsonwebtoken') // imported JWT (json web token)
const JWT_SECRET = 'Harryisagoodb$oy' // keep this key secret, because using this key we are going to sign the web Token.

const fetchuser = (req, res, next) => { // middleware function named fetchuser takes req, res, and next, we called the next() function there in the code.
    // Get the user from the jwt token and add id to req object.
    const token = req.header('auth-token');
    if (!token) { // if this token is not available then we show this error
        res.status(401).send({ error: "Please authenticate using valid token Doremon" })
    }

    try {
        const data = jwt.verify(token, JWT_SECRET) // here we verify the token and JWT_SECRET.
        req.user = data.user; // now we set the data.user to the req.user.
        next() // next() fucntion is called // this next() function means the async function of Rout-3 which is in the auth.js
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using valid token Doremon" })
    }

}


module.exports = fetchuser; // exporting fetchuser// this is used in auth.js file for, to get loggedin user details using POST

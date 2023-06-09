const User = require('../models/User'); // imported User.js
const { body, validationResult } = require('express-validator'); //imported express-validator to handle invalid inputs for name, email and passwords.
const express = require('express');
const router = express.Router()// const router= express.Router()
const bcrypt = require('bcryptjs'); // imported bcrypt
var jwt = require('jsonwebtoken') // imported JWT (json web token)

const fetchuser = require('../middleware/fetchuser'); // imported fetchuser from the fetchuser.js file.

const JWT_SECRET = 'Harryisagoodb$oy' // keep this key secret, because using this key we are going to sign the web Token.
// you can save above variable JWT-SECRET in .env.local

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// Rout-1 // Creating a user ///////////////////////////////////////////

// bellow code work is if the name, email or password is invalid then it will raise an error, and this is done by express-validator.
router.post('/createuser', [ // instead of '/' we write '/createuser'
  body('name', 'enter valid name doremon').isLength({ min: 3 }),
  body('email', 'enter valid email doremon').isEmail(),
  body('password', 'enter valid password doremon').isLength({ min: 3 }),
], async (req, res) => { // we made this function async
  // if there are errors, then return bad request and the errors
  let success = false; // added success condition here
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }

  // bellow code will save the data into the MongoDB/
  // the dublicate name and email wont save to the MongoDB
  // check whether the user with this email is exist already
  try { // used try here
    let user = await User.findOne({ email: req.body.email }) // this is a promise so used await here
    if (user) {
      console.log(user) // temp
      return res.status(400).json({ success, error: "Sorry a user with this name is already exist" })
    }

    const salt = await bcrypt.genSalt(10); // this will genrate salt for our password
    const secPass = await bcrypt.hash(req.body.password, salt) //this line will save the salt in the password and hash it.
    user = await User.create({ // used await here.
      name: req.body.name,
      // password: req.body.password, // commented this and used bellow
      password: secPass, // use used secPass which is our inputed password+salt+hash by using bcrypt.
      email: req.body.email,
    })


    const data = { // created data variable for authtoken named variable
      user: {
        id: user.id
      }
    }

    const authtoken = jwt.sign(data, JWT_SECRET) // this is authtoken named variable.
    // console.log(authtoken)// printing authtoken.

    success = true; // made success condition variable true.
    res.json({ success, authtoken }) // this sends response which is authtoken. // added success condition variable

  } catch (error) { // this will catch the error and show the bellow error messages
    console.error(error.message)
    res.status(500).send("Internal Servar Error Doremon")
  }

})


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// Rout-2 // Authenticate a user ////////////////////////////////////////

// we are Authenticate a user using: POST "/api/auth/login" and for this, no login required.

router.post('/login', [ // this time we write '/login' because this code is for login the user, means authenticate a user.
  body('email', 'enter valid email doremon').isEmail(),
  body('password', 'Password cannot be blanked Doremon').exists(),
], async (req, res) => {
  let success = false;

  // if there are errors, then return bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body // we using destructuring, to take user inputed email and password from the body as a variables.
  try { // in the try statement we will try to take user if he exist.
    let user = await User.findOne({ email }); // it is important to use await here.
    if (!user) { // if the user does not exist then this error will be print.
      success = false;
      return res.status(400).json({ error: "Sorry user does not exist Doremon" })
    }

    // in the bellow we have to use await.
    const passwordCompare = await bcrypt.compare(password, user.password)// this will compare the user inputed password to the database user password to authenticate.
    if (!passwordCompare) { // if the password is wrong then this error will be print.
      success = false;
      return res.status(400).json({ success, error: "Sorry password is wrong Doremon" })
    }

    // bellow code work if the user and email is exist on the database
    const data = { // we are using user id of authenticated user to identify only his data, i guess.
      user: {
        id: user.id
      }
    }
    success = true; 
    const authtoken = jwt.sign(data, JWT_SECRET) // we sign the jwt authtoken with data and JWT_SECRET.
    res.json({ success, authtoken }) // this sends response to the user which is authtoken. // added success named varibale which is true/false condition will be usefull for us.

  } catch (error) { // this will catch the error and show the bellow error messages
    console.error(error.message)
    res.status(500).send("Internal Servar Error Doremon")
  }

})



///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// Rout-3 // Authenticate a user // (Start) /////////////////////////////

// Get loggedin user details using POST: "/api/auth/getuser". (login required, means we need to send jwt token).

router.post('/getuser', fetchuser, async (req, res) => { //that fetchuser will fetch the user (fetchuser is a middleware which comes from fetchuser.js file), it is used for authentication reason here.
  // above fetcuser is a middleware function, that will called whenever the login roots gets a access request, we have wrote a middleware named fetchuser.js and imported it here.
  // in the fetchuser.js file we will modify the req and res then we will get the user from req.

  try {
    userId = req.user.id; // here we get the user.id from the req. as we said in the above line. 
    const user = await User.findById(userId).select("-password")
    res.send(user) // and we send the user respons.
  } catch (error) { // this will catch the error and show the bellow error messages
    console.error(error.message)
    res.status(500).send("Internal Servar Error Doremon")
  }

})



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = router //we exported our router
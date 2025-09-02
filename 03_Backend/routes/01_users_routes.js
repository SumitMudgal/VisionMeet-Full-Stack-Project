// Routes related to User

// Import Express
const express = require("express");

// Import "Router()" of Express for Routes
const router = express.Router();

// Import Controller Files
const new_user_register = require("../controllers/01_new_user_register");
const user_login = require("../controllers/02_login");

//------------------------------------------------------------

// Import the "isLoggedIn" function to check if the User Logged in or Not.
const isLoggedIn = require("../controllers/04_is_Logged_In_Token_Verification")

// import the "user_Logout" function to make to user Logout
const user_Logout = require("../controllers/05_user_logout");

//---------------------------------------------------------------

// Routes 

// Routes after route "/user"

// A] New User Registration Route

// 1] POST    "/register"     =>  route for creating new user

router.post("/register", new_user_register);


// B] Login Route

// 1] POST    "/login"   => route to login user

router.post("/login", user_login);


// note: After creating Middleware of "isLoggedIn".

// C]  Check LoggedIn or Not Route

// 1] GET      "/check-login"   =>  Check if any User already Logged in or not.
router.get("/check-login", isLoggedIn, (req, res) => {
    
    return res.status(200).json({
        message: "User is Already Logged In",
        user: req.user 
    })
})


// D] Logout route  =>  "/logout"
router.post("/logout", isLoggedIn, user_Logout); 

// Export "Router" to export all these Routes , so we can access in "index.js"
module.exports = router;



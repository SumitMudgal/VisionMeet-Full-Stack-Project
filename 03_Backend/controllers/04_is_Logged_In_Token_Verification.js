// Middleware Logic for the verification of TOKEN i.e. "isLoggedIN" to cj=heck if the any ser already Llogged in or Not.

const User = require("../models/01_user");

// Function for checking "isLoggedIn"

const isLoggedIn = async (req, res, next) => {

    try {
        // Get the "Token" form Request Headers
        let token = req.headers["authorization"];

        // If No Token Exists in Request Header, that means No User is Currently logged In.
        // Ask User to Login
        if(!token) {
            return res.status(401).json({message: "No User Logged In, Please Login"});
        }

        // Else, if the Token Exist, check if there is any User in The User Collection of database with this Token
        else {
            let user = await User.findOne({token: token});
            
            // If No User Exist with this token, that means Wrong Token present in request, ask user to Login Again.
            if(!user) {
                return res.status(401).json({message: "Invalid Token, Please login Again!"});
            }

            // Else, If there is any "User" with this token, check if Current date is less than or greater the the Expiry of Token.
            else {
               let originalTokenExpiry = user.tokenExpiry;

               // Get present Time to comapre with expiry.
               let currentTime = Date.now(); // Date.now();

               // If Token Expiry is Less than Current Time, means the Session is Expired, Login Again.
               if(originalTokenExpiry < currentTime)
               {
                  return res.status(401).json({message: "Session Expired, Please Login Again"});
               }

               // Else, The USer is Currently Logged In
               // Attach the User to request Object for Next Route/Controller
               req.user = user;

               next();
            }
            
        }
    }
    catch(err) {
        console.log("Some error Occured", err);
        return res.status(500).json({message: "Server Error"});
    }
}

module.exports = isLoggedIn;


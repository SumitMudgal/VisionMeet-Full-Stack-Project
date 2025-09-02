// Login Verification using Database

const mongoose = require("mongoose");

// Import Model of User
const User = require("../models/01_user.js");

// ** Import "BCRYPT" for checking if The I/P password with the UnHashed form of Original database password.
const bcrypt = require("bcrypt");

// Import "CRYPTO" to create a Random "Token" after user login credentials match, to assign that token to user.
const crypto = require("crypto");

// Function for Login

const user_login = async (req, res) => {
    // Extract all the I/P data from user
    const {username, password} = req.body;

    try{
        // Check if the User already Exist in the Data base or not.
        const user = await User.findOne({username: username});

        // If Exists in Database, check password
        if(user) {
           let checkPassword = await bcrypt.compare(password, user.password) ;

           // If Password is Correct, Generate the "Token" using "Crypto",
           if(checkPassword == true)
           {
             // Create a NEW TOKEN for User as a Login Id.
              let new_token = crypto.randomBytes(20).toString("hex");
              
             // Also create an EXPIRY Time for that TOKEN, so that after that time, the User may LogOut automatically
             let tokenExpiryTime = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);  // Expiry time after Login i.e. Token created will be "2 Days". 
               
              // Assing this newly generated token "new_token" to User's "token" filed in database.
              user.token = new_token;

              // Assign the Expiry of that new user Token to "users's tokenExpiry" database model field.
              user.tokenExpiry = tokenExpiryTime;

              // Save this updated value of User document fiels in database
              await user.save();

              return res.status(200).json({message: "LoggedIn Successfully!!", token: new_token, expiresAt: tokenExpiryTime});
           }
           else
           {
             return res.status(401).json({message: "Wrong Password Entered!!"});
           }

        }
        else
        {
            return res.status(400).json({message: "User Not Found!!"});
        }
        
    }    
    catch(err) {
        return res.status(500).json({message: "Something went wrong!!"});
    }
}

module.exports = user_login;




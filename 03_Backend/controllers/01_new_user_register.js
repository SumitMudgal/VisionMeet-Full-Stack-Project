// New USer registrationin in Database

const mongoose = require("mongoose");

// Import User Model i.e. Collection
const User = require("../models/01_user.js");

// ** Import "BCRYPT" for hashing password before creating New User.
const bcrypt = require("bcrypt");

// Install "CRYPTO" from npm as we will use it to generate "Token" for user.



// Function to create new User:-

const new_user_register = async (req , res) => {

    // Get all the new user details from I/P
    const { name, username, password } = req.body;

    try{
        // Check if the User Already Exists or Not in the database.
       const alreadyExist = await User.findOne({ username: username });

       if(alreadyExist) {  // If Already Exist, retuen Error
           return res.status(400).json({ message: "User Already Exists, Please login when redirected!" });
        }   
        else  // if Not Alrady Exist, Create new User in database.
        {
           // Create the Hash Paaword of original User Entered Password
           let hashPassword = await bcrypt.hash(password, 10);  // Salting with 10 elements per original element in password.
       
           // Creating New Document of New User of User Collection Model.
           let new_user = new User({
              name: name,
              username: username,
              password: hashPassword
            });
        
            // Save New User in Database
            await new_user.save();
        
            console.log("New User Created Successfully!");
            return res.status(201).json({ message: "New User Created Successfully!" });
        }

    }
    catch(err){
        res.status(500).json({message: "Some error Occured", err});
    };
}


module.exports = new_user_register;





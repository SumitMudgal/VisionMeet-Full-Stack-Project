// User Model

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Schema i.e. Structure of Document of User Collection
const userSchema = new Schema({

    name: {
        type: String,
        trim: true,
        required: true
    },

    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    
    password: {
        type: String,
        required: true,
        trim: true
    },
    
    token: {
        type: String,
    },

    // Expiry of Tokens, to automatically LOg Out the user after Token Expires
    tokenExpiry: {
        type: Date   // When the Token should expire
    }

});


// Creating Model and Collection of User Schema
const User = mongoose.model("User", userSchema);

module.exports = User;







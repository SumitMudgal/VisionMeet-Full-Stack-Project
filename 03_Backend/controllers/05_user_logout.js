// Logic to get User Logout from the website

const User = require("../models/01_user")

const user_Logout = async (req, res) => {

    try {
        // req.user is already available from "isLoggedIn" Middleware till now.
        const userObjectId = req.user._id; // get the database Collection Documents's User's "Object Id".

        // Remove the Token, i.e. make it Null of that User in the database
        await User.findByIdAndUpdate(userObjectId, {token: null});

        return res.status(200).json({message: "User Logged Out Successfully!"});
    }
    catch(error) {
        res.send(500).json({message: "Error while loggin Out! Please try again later.", error: error.message});
    };
};

module.exports = user_Logout;










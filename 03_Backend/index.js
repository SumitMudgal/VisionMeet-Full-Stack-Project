// Import Express
const express = require("express");

const app = express();

// MongoDb Atlas Connect
require("dotenv").config();

// middleware for parsing req.bodyand other i/p data
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Import CORS
const cors = require("cors");

// Import SERVER from "socket.io"
//import { Server } from "socket.io";
const { Server } = require("socket.io");

// Import "connect_To_Socket" from "03_socketManager.js" file
const connect_To_Socket = require("./controllers/03_socketManager.js");

// Import "createServer" from "node:http"
const { createServer } = require("node:http");

//------------------------------------------------------------------------------------------------

// Mongoose
const mongoose = require("mongoose");

main().then(() => {
    console.log("connection successfull");
}).catch(err => console.log(err));


async function main() {
   // await mongoose.connect("mongodb://127.0.0.1:27017/VisionMeet"); // Local Pc Database connect.

   // Connect to MongoDb Atlas Database "VisionMeet"
   await mongoose.connect(process.env.ATLASDB_URL);
};

//---------------------------------------------------------------------------------------------

/*
Why CORS needed?

=> Why it’s needed?

By default, browsers block requests from one domain/port to another (security reason).

cors middleware tells the browser “yes, this frontend is allowed to talk to me.”
*/

// ** Use "CORS"
app.use(cors({
    origin: "http://localhost:5173",   // "*" means from all Frontend URL
    methods: ["GET", "POST"],
    credentials: true  // if you send cookies/auth

}));

//-----------------------------------------------------------------------------------

// "createServer" ki madad se hum hamare Express ka instance i.e. "app" and Socket ka Server ko ek durse se Connect karne me.
const server = createServer(app);

// After creating Server, Call "socketManager function" here.
connect_To_Socket(server);

// Now, we will create . New SERVEr in a variable named as "io", in which we paas the "server".
// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:5173", // your frontend
//         methods: ["GET", "POST"],
//         credentials: true
//     }
// });

// So, now our Server has both "app" and "io" itself.

//-------------------------------------------------------------------------

// ** Import All Routes related to User.
const user = require("./routes/01_users_routes.js");


//--------------------------------------------------------------------------------------------------

// 1st Get request For practice checking
app.get("/check", (req, res) => {
    console.log("Hello Word");
    // Also print on scrren of webpage
    return res.send("Hello World");
})

//-------------------------------------------------------------------------------------


// Use Routes "user" for route "/"
app.use("/user", user);


//-------------------------------------------------------------

// Listen to port
let port = 8080;

// app.listen(port, () => {
//     console.log(`Listening to port ${port}`);
// })

// After "app" is linked with "server", simply Listen with "server" only.
server.listen(port, () => {
    console.log(`Listening to port ${port}`);
})






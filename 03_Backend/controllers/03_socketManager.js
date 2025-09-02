// Socket Manager i.e. Socket Related Functions:-


let rooms_and_users_connections = {};  // This will contain all the connections i.e. users

/*

"rooms_and_users_connections" is an object storing all sockets (users) currently connected to a specific "room"

Example of data in "rooms_and_users_connections"

rooms_and_users_connections = {
    "room_id_1": [
        { socketId: "socket123", userId: "sumit123" },
        { socketId: "socket456", userId: "rahul456" }
    ],
    "room_id_2": [
        { socketId: "socket789", userId: "neha789" }
    ],
    ...
}

*/

let messages = {};  // This will contain all the messages


/*
"messages" will store data like:

"messages = {
    "room1": [
        { userId: "sumit123", text: "Hello guys!", timestamp: "2025-08-29T14:10:00" },
        { userId: "rahul456", text: "Hi Sumit!", timestamp: "2025-08-29T14:11:00" }
    ],
    "room2": [
        { userId: "neha789", text: "Welcome to room2!", timestamp: "2025-08-29T14:12:00" }
    ]
}"
*/


// Initialize socket manager function:-

const connect_To_Socket = (server) => {

    const { Server } = require("socket.io");

    // Create a Varaiable say "io", that will store the Socket.Io Instance.
    let io = new Server(server, {
        cors: {
            origin: ["https://visionmeet-full-stack-project.netlify.app","http://localhost:5173", "*"],
            methods: ["GET", "POST"]
        }
    });

    console.log("Socket.Io Manager Initialized Successfully");

    // Handle Socket Connections and Working Functions:-
    io.on("connection", (socket) => {
        
        console.log(`User Connected: ${socket.id}`);

        // All Socket Related Working Functions:-

        // 1] Any New User Joins a Room i.e. Call
        socket.on("join-room", ({room_id, user_id}) => {
           
            console.log(`User${user_id} joined room ${room_id}`);

            socket.join(room_id);
            
            // 1] If "user_id" is not provided for the provided "room_id", then empty array only.
            if(rooms_and_users_connections[room_id] == undefined)
            {
                rooms_and_users_connections[room_id] = [];
            }

            
            // 2] Store "socket.id" and "user_id" in the connections object of rooms and users
            rooms_and_users_connections[room_id].push({ socketId: socket.id , userId: user_id });

            

            // 2] Notify All the Other Already Existing Users in the Room, about new User joined
            for(let i = 0; i < rooms_and_users_connections[room_id].length; i++)
            {   
                const targetSocketId = rooms_and_users_connections[room_id][i].socketId;

                if (targetSocketId === socket.id) continue;


                // Send the New User's UserId and SocketId to existing members of meeting room.
                io.to(targetSocketId).emit("user-joined", {
                    socketId: socket.id,
                    userId: user_id
                },

                // Also Send the new Update Connection Rooms Users List
                rooms_and_users_connections[room_id]
               );
            }



            //2] Handaling Earlier Messages of Meeting before New User joined from User side.
            // Same for messages as we did for "connections of rooms and users"
            if(messages[room_id] != undefined) // If Some message existed in the room, then show it to new user
            {
                for(let i = 0; i < messages[room_id].length; i++)
                {
                    io.to(socket.id).emit("chat-message", messages[room_id][i]);
                };

            }            
        
        });
        
        
        // 3] "send-message" i.e. handaling a New Message sent by a User in the Meeting
        socket.on("send-message", ({ room_id, user_id, messageText }) => {

                if(messages[room_id] == undefined) // If Current Message is the First message of the Room.
                {
                   // Create an Empty Array, as no user starts messageing yet.
                   messages[room_id] = [];
                }

                // New message Object for storing in "messages" variable.
                let newMessage = {
                    userId: user_id,
                    message: messageText,
                    postTime: Date.now()
                };

                // Push this new Message details in the "messages" object at key "room_id".
                messages[room_id].push(newMessage);

                // BroadCast this New Message to Everyone in the Meeting Room
                for(let i = 0; i < rooms_and_users_connections[room_id].length; i++)
                {
                    io.to(rooms_and_users_connections[room_id][i].socketId).emit("new-message", newMessage);
                };
        });
        

        // 4] Handaling "leave-room"
        socket.on("leave-room", ({ roomId, userId }) => {

            console.log(`${userId} Left Meeting Room: ${roomId}`);

            // Remove user from "rooms_and_users_connections"
            if(rooms_and_users_connections[roomId])
            {
                rooms_and_users_connections[roomId] = rooms_and_users_connections[roomId].filter(user => user.socketId !== socket.id);
            }    

            // Notify Others with emit "user-left"
            socket.to(roomId).emit("user-left", { socketId: socket.id });

            // Make the User actually leave the Room
            socket.leave(roomId);
        });
        

        // 5] Handaling Disconnection
        socket.on("disconnect", () => {
            console.log("User Disconnected:", socket.id);
        
            for(let roomId in rooms_and_users_connections)
            {
               rooms_and_users_connections[roomId] = rooms_and_users_connections[roomId].filter((user) => user.socketId !== socket.id);

                io.to(roomId).emit("user-left", {socketId: socket.id});

            }

        });
        

        // 6] Handle "offer"
        socket.on("offer", ({ to, sdp }) => {
           io.to(to).emit("offer", { sdp, sender: socket.id });
        });

        // 7] Handle Answer
        socket.on("answer", ({ to, sdp }) => {
           io.to(to).emit("answer", { sdp, sender: socket.id });
        });

        // 8] Handle ICE Candidates
        socket.on("ice-candidate", ({ to, candidate }) => {
           io.to(to).emit("ice-candidate", { candidate, sender: socket.id });
        });



    });  
}


module.exports = connect_To_Socket;





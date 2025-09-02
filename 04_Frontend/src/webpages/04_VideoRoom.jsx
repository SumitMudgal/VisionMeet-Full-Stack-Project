// 4th Page i.e. "Video Room" Page.

import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";


// Import "io" from "socket.io-client"
import io from "socket.io-client";


// Define the "Backend Server url"
const server_url = "http://localhost:8080";

const connections = {};  // We will push our connections here.

// Peer Config Connections and STUn server setup
const peerConfigConnection = {
       "iceServers" : [
             {"urls": "stun:stun.l.google.com:5349"}
       ]
};


// Function that handles Video room
function VideoRoom() {

  let socketRef = useRef();

  let socketIdRef = useRef();

  let localVideoRef = useRef();

  const [videoAvailable, setVideoAvailable] = useState(true);  // Pehle apan check karege ki kya apne paas Video Permission hai, Agar hai to iss Variable ko "true" set karege, Nahi to "false" set karege. By default "true" set kardete hai, i.e. Camera Permission of device.

  const [audioAvailable, setAudioAvailable] = useState(true);  // Pehle apan check karege ki kya apne paas Audio Permission hai, Agar hai to iss Variable ko "true" set karege, Nahi to "false" set karege. By default "true" set kardete hai i.e. assuming we have Audio permission i.e. Microphone Permission of device.

  const [video , setVideo] = useState();  // Pehle apan check karege ki kya apne paas Video Permission hai, Agar hai to iss Variable ko "true" set karege, Nahi to "false" set karege. By default "true" set kardete hai, i.e. Camera Permission of device.

  const [audio, setAudio] = useState();  // Pehle apan check karege ki kya apne paas Audio Permission hai, Agar hai to iss Variable ko "true" set karege, Nahi to "false" set karege. By default "true" set kardete hai i.e. assuming we have Audio permission i.e. Microphone Permission of device.

  const [screenShare, setScreenShare] = useState();

  const [screenShareAvailable, setScreenShareAvailable] = useState();

  const [userName, setUserName] = useState("");

  const [messages , setMessages] = useState([]); // ** This array will be used to store the New Messages of users to show those messages in our Chats Window.

  // ** IMP
  const videoRef = useRef();

  const [videos, setVideos] = useState([]);  // * We use to store videos of Other Existing meeting Users.

//--------------------------------------------------------------------------------------------------------------------
  
// Extract Room id from Body Params
  let { roomId } = useParams();

// Status of meeting joined or not
  const [joined , setJoined] = useState(false); 
  
  // Mic and camera
  const [mic, setMic] = useState(true);

  const [camera, setCamera] = useState(true);

// Messages related Variable

 const [showChat, setShowChat] = useState(false);

 const navigate = useNavigate();

 // User's Own Message to that he will send to other's
 const [newMessage, setNewMessage] = useState("");

//----------------------------------------------------------------------------------------------------


// "Get Permission" Function  => We will get the permissions of Audio , Video, screensharing in this fucntion.
  let getPermissions = async () => {
    
    try {
      // Video Permission i.e. "Camera permission"
      let videoPermission = await navigator.mediaDevices.getUserMedia({video: true});  // Ask User for Camera Access i.e. Video Permission.
    
      if(videoPermission)  // If Video Permission is Allowed by user
      { 
         setVideoAvailable(true);
      }
      else
      {
         setVideoAvailable(false);
      }


      // Audio Permission i.e. "Microphone Permission"
      let audioPermission = await navigator.mediaDevices.getUserMedia({audio: true});  // Ask User for Camera Access i.e. Video Permission.
    
      if(audioPermission)  // If Audio Permission is Allowed by User
      {
         setAudioAvailable(true);
      }
      else
      {
         setAudioAvailable(false);
      }


      // ScreenSharing permission
      //let screenShare = await navigator.mediaDevices.getDisplayMedia();
      if(navigator.mediaDevices.getDisplayMedia)
      {
        setScreenShareAvailable(true);
      }
      else
      {
         setScreenShareAvailable(false);
      }

       

      // Create Stream based on Permission

      if(videoAvailable || audioAvailable)
      {
         const userMediaStream = await navigator.mediaDevices.getUserMedia({video: videoAvailable , audio: audioAvailable});
     
         // If User Media Stream is available, Then Set the User's own Window LocalStream Equal to this UserMediaStream
         if(userMediaStream)
         {
           window.localStream = userMediaStream;

           // Set "localVideoRef" as our UserMediaStream now, so that Our Video & Audio will get Store in our "LocalVideoRef" state variable
           if(localVideoRef.current)  // ".current" means nothing but Current Time i.e. position of element i.e. After rendering the page . 
           {
              localVideoRef.current.srcObject = userMediaStream;
           }
         }

        }
    
    }
    catch(err) {
        console.log(err);
    }
  }

// usEffect: "Operations of all Permissions and all checking before joining the Meeting"
  useEffect(() => {
     
     // Get Permissions from User for Vide, Audio, screenSharing, etc..
     getPermissions();
  },[]);




// GetUserMediaSuccess  



// getUserMedia  => Any Media Permission or data changes, So Now get the Updated User Media Data i.e. video audio etc...
  let getUserMedia = () => {
        // if Both Media are Available and have data
       if((video && videoAvailable) || (audio && audioAvailable))
       {
          navigator.mediaDevices.getUserMedia({video: video, audio: audio});

       }
       else  // Else, Stop the Track i.e. data of Audio or Video, as we dont have permission to capture that now.
         {
            try {
               let tracks = localVideoRef.current.srcObject.getTracks(); // getTracks() hume Audio Video ka Track i.e. data laake deta hai.

               tracks.forEach(track => track.stop());  // Stop the Tracking i.e. Collectiong Data of Audio Video, etc.. 
            }
            catch(err)
            {
               console.log(err);
            }
         }  

  }   

// useeffect =>  to update values of Video and Audio whenever changes
  useEffect(() => {
      // if "Video" and "Audio" State variable me Data avilable hai i.e. They are not "Undefined"
      if(video != undefined && audio != undefined)
         {
             // Update new details of User's Media i.e. Audio Video etc...
             getUserMedia();
         } 

  }, [video, audio])


// "connecToSocketServer" function => 
   let connecToSocketServer = (username) => {

      socketRef.current = io.connect(server_url, { secure: false });  // Apne Device ke "socket" ke "current" i.e. real time  me "Io" se connection banake Data daaldiya.
      
      // On Connection EstablisedwE9JA 
      socketRef.current.on("connect", async () => {
         
         console.log("Connected to Socket Server: ", socketRef.current.id);


         // Join the Meeting Room with room Id + UserName
         socketRef.current.emit("join-room", {room_id: roomId, user_id: username});

         socketIdRef.current = socketRef.current.id;

      });

      // -----------------------------
         // A] When someone new joins room
         // -----------------------------
         
         socketRef.current.on("user-joined", (newUser, updatedUsersList) => {  // "newUser" is an Object that contains new User's "socketId" and "userId". "updatedusersList" is the Array of all the user's object present in it.
              console.log("New User Joined", newUser);
              console.log("Updated meeting Participants:- ", updatedUsersList);
              
              // New Logic Date:30/08/2025

              // When a New User Joined the meeting, Make a "Peer 2 Peer" Connection.
              let peer = new RTCPeerConnection(peerConfigConnection);

              // Save the New Peer Connection of New User Joined in Variable "connections", the "peer" connection will be the Value and "key" will be the New User's "socketId".
              connections[newUser.socketId] = peer;

              // Add Local Tracks i.e. Video , Audio, etc.. to new Peer Connection
              window.localStream.getTracks().forEach((track) => {
                   peer.addTrack(track, window.localStream);
              });


              // Remote Stream
              peer.ontrack = (event) => {
                 // Push the Video Data in "videos" Array.
                 setVideos((prev) => {
                    
                    let doesAlreadyExists = prev.find(v => v.id === newUser.socketId);

                    // If Not already exist, push it, else return previous array only.
                    if(!doesAlreadyExists)
                    {
                       return [...prev, { id: newUser.socketId , stream: event.streams[0]}];
                    }

                    return prev;

                 }); 
              }


              // ICE Candidate
              peer.onicecandidate = (event) => {
                
                 if(event.candidate)
                 {
                    socketRef.current.emit("ice-candidate", {
                       to: newUser.socketId,
                       candidate: event.candidate 
                    });
                 } 
              };


              // Create and Send Offer
              peer.createOffer().then(offer => {
                  peer.setLocalDescription(offer);
                  socketRef.current.emit("offer", {to: newUser.socketId, sdp: offer});
              });
         });


         // -----------------------------
         // B] Old Messages chat history
         // -----------------------------
         socketRef.current.on("chat-message", (oldMessage) => {
             setMessages((prev) => [...prev, oldMessage]);
         });


         // -----------------------------
         // C] New chat messages
         // -----------------------------
         socketRef.current.on("new-message", (newMessage) => {
             console.log("New Message: ", newMessage);

             setMessages((prev) => [...prev, newMessage]);
         });

         // D] user-left
         socketRef.current.on("user-left", () => {

         })


         //----------------------------------
         // D] Handle Offer from Remote
         //----------------------------------

         socketRef.current.on("offer", async ({ sdp, sender }) => {
             // Create new Connection for Remote User Data
             let peer = new RTCPeerConnection(peerConfigConnection);

             // Push this new Connection in our variable "connection" with key as "Sender" which is the Sending User's socket Id and value as Peer Connection.
             connections[sender] = peer;

             // Add Local Stream
             window.localStream.getTracks().forEach(track => {
                peer.addTrack(track, window.localStream);
             });

             // Update Videos Array
             peer.ontrack = (event) => {
                    
                  setVideos((prev) => {
                    
                    let doesAlreadyExists = prev.find(v => v.id === sender);

                    // If Not already exist, push it, else return previous array only.
                    if(!doesAlreadyExists)
                    {
                       return [...prev, { id: sender , stream: event.streams[0]}];
                    }

                    return prev;

                 }); 
             };


             peer.onicecandidate = (event) => {
               
               if(event.candidate)
               {
                  socketRef.current.emit("ice-candidate", { to: sender, candidate: event.candidate });
               }
               
             }

            
             await peer.setRemoteDescription(new RTCSessionDescription(sdp));
             
             const answer = await peer.createAnswer();

             await peer.setLocalDescription(answer);

             socketRef.current.emit("answer", { to: sender, sdp: answer });

         });


         //----------------------
         // E] Handle "answer"
         //----------------------
         socketRef.current.on("answer", ({ sdp, sender }) => {
             let peer = connections[sender];
             peer.setRemoteDescription(new RTCSessionDescription(sdp));
         });


         //------------------------
         // F] Handle ICE
         //------------------------
         socketRef.current.on("ice-candidate", ({ candidate, sender }) => {
             let peer = connections[sender];

             if(candidate && peer)
             {
                peer.addIceCandidate(new RTCIceCandidate(candidate));
             }
         });


         //-------------------------
         // G] Handle "user-left"
         //-------------------------
         socketRef.current.on("user-left", ({ socketId }) => {
             
            console.log("User Left: ", socketId);

            // Close the Peer Connection of that Exited User.
            if(connections[socketId])
            {
               connections[socketId].close();

               delete connections[socketId];
            }

            // Remove that User's Video from the "Videos" Array
            setVideos((prev) => prev.filter(v => v.id !== socketId));

         })


   }


// getMedia  => Set "Video" and "Audio" data
   let getMedia = () => {
      setVideo(videoAvailable);
      setAudio(audioAvailable);

      // Connect to Socket Server  (Do it later)
   }  


  //-------------------------------------------------------------------------------------------------------
    // Button Handlers
    function toggleMic() {

      if (window.localStream) {
        window.localStream.getAudioTracks().forEach(track => {
            track.enabled = !track.enabled; // true → unmuted, false → muted
        });

        setMic(!mic);
    }
    
   };

    function toggleCamera() {
        
      if (window.localStream) {
        window.localStream.getVideoTracks().forEach(track => {
            track.enabled = !track.enabled; // true → on, false → off
        });

        setCamera(!camera);
      }
    
   };


   // On Username Change Field
   function onUsernameChange(event) {
      setUserName(event.target.value);
      //console.log(userName);
   }

   // On Click of Join Meeting
   function onJoinMeeting() {

      let finalUserName = userName;
       
      if(!finalUserName)  // If UserName Not Exists, keep it as Guest
      {
         let randomNo = Math.floor(1000 + Math.random() * 9000).toString();

         finalUserName = `Guest${randomNo}`;

         setUserName(finalUserName);
      }


      // Connect to Socket Server (if not already)
      if(!socketRef.current)
      {
         connecToSocketServer(finalUserName);  // join-room + setup listeners // Paas Username while connecting to Socket Server.
         setJoined(true);
      }

      console.log("Joined Room: ", roomId, "with username: ", finalUserName);
  
   };


   // On leave Meeting Button
   function onLeaveMeeting() {
      Object.values(connections).forEach(peer => peer.close());
      window.localStream.getTracks().forEach(track => track.stop());
      
      if (localVideoRef.current) localVideoRef.current.srcObject = null;
      
      // User-left Emit
      socketRef.current.emit("leave-room", { roomId, userId: userName });

      socketRef.current.disconnect();
      setVideos([]);
      setJoined(false);

      navigate("/");
   }


   // On Chat Show Button Click
   function onChatShow() {

      setShowChat(!showChat);
   }


   // On Send Message
   function sendMessage() {
      if(newMessage.trim() !== "" && socketRef.current) {
        socketRef.current.emit("send-message", {
          room_id: roomId,
          user_id: userName,
          messageText: newMessage
        });

        setNewMessage(""); // clear input
      }
   }

//-----------------------------------------------------------------------------------

    // Frontend
    return(

      <div className="Meeting flex flex-row min-w-full">

        {/* Video Section */}
        <div className="videoRoom flex-1"> {/* "flex-1" class means the div will take all the Remaining Width available on scrre, when no other element present in flex.*/}

           <div className="meetingDetails flex justify-center items-center">
              <h1 className="text-blue-300 font-bold text-3xl">Meeting Id: {roomId}</h1>
           </div>

           <br /><br />
           
           <div className={`preview flex flex-col ${showChat ? "lg:w-320 md:w-150 sm:w-100" : "min-w-full"} justify-center items-center`}>
               <div className="usernameDetails">
                  {
                     (joined == false) ?
                     <span>
                        <label htmlFor="username" className="text-amber-400 font-bold text-xl">Username:- </label>
                        <input onChange={onUsernameChange} type="text" placeholder="Enter Username" name="username" className="bg-amber-100 rounded-sm" ></input>
                     </span> :
                     
                     <span>
                        <b className="text-purple-600 text-xl">Username:- </b>
                        <i className="text-xl text-orange-600">{userName}</i>
                     </span>
                  }
               </div>

               <br /><br />

               <div className="videoPreview bg-gray-500 w-80 h-60 rounded-sm lg">
                  <video ref={localVideoRef} autoPlay muted className="rounded-md border-4 border-sky-400"></video>
               </div>

               <br /><br />

               {/* Remote Videos */}
              { (joined == true) ?
                <div className="remoteVideos flex flex-wrap gap-4">
                  {videos.map(user => (
                      <video key={user.id} autoPlay className="w-60 h-46 border-4 border-purple-600 rounded-lg"
                        ref={(video) => {if (video) video.srcObject = user.stream; }}
                      >
            
                      </video>
                  ))}

                </div> :
                 <span></span>
               }

               <br /><br />

               {
                  (joined == false) ? 
                  <button onClick={onJoinMeeting} className="bg-amber-400 rounded-md h-8 w-30 font-medium hover:bg-amber-300">Join Meeting</button> :
                  <button onClick={onLeaveMeeting} className="bg-amber-400 rounded-md h-8 w-30 font-medium hover:bg-amber-300">Leave Meeting</button>
               }

               <br /><br />

           </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* Meeting Consoles footer tab */}
        {
                  (joined == true) ?
                  <div className="meetingConsoles flex flex-row justify-center items-center gap-20 bg-gray-700 min-w-full h-20 fixed bottom-0">
                      
                      {
                        (mic == true) ? <i onClick={toggleMic} className="fa-solid fa-microphone text-green-600 text-2xl"></i> : <i onClick={toggleMic} className="fa-solid fa-microphone-slash text-red-800 text-2xl"></i>
                      }
                     
                      {
                         (camera == true) ? <i onClick={toggleCamera} className="fa-solid fa-video text-green-600 text-2xl"></i> : <i onClick={toggleCamera} className="fa-solid fa-video-slash text-red-800 text-2xl"></i>
                      }

                      <i onClick={onChatShow} className="fa-solid fa-message"></i>
                  </div> :
                  <span></span>
         }

      {/* ---------------------------------------------- */}

      {/* Messages Window */}
      
      {
         (joined == true && showChat == true) &&

         <div className="messageWindow fixed flex flex-col bg-gray-700 p-2 mr-2 mt-2 mb-2 ml-0 overflow-x-hidden wrap-break-word top-3 bottom-20 left-1 right-2 h-[85vh] rounded-lg shadow-lg border-l-2 border-gray-800 lg:w-100 lg:top-7 lg:left-auto lg:bottom-auto md:w-70 md:top-7 md:right-0 md:left-auto md:bottom-auto sm:w-60 sm:top-7 sm:right-0 sm:left-auto sm:bottom-auto">
             {/* <p>Hello</p> */}

             {/* Header */}
             <div className="flex justify-between items-center border-b border-gray-500 pb-2 mb-2">
                <h2 className="text-lg font-bold text-white">Chat</h2>
                <button onClick={onChatShow} className="text-gray-300 hover:text-white mr-2">X</button>
             </div>

             {/* Messages List */}
             <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                  {messages.map((msg, index) => (
                      <div key={index} className={`p-2 rounded-lg max-w-[70%] break-words ${msg.userId === userName ? "bg-blue-600 text-white self-end ml-auto" : "bg-gray-500 text-white"}`}>

                           <p className="text-sm"><b>{msg.userId}:</b> {msg.message}</p>

                           <span className="text-xs text-gray-300">{new Date(msg.postTime).toLocaleTimeString()}</span>
                      </div>
                  ))}
             </div>

             {/* Input Field for User's own Message typing*/}
             <div className="flex mt-2 gap-2">
                 <input type="text" placeholder="Type a message to send..." className="flex-1 p-2 rounded-lg bg-gray-600 text-white outline-none" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()}></input>
             
                 <button onClick={sendMessage} className="bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-lg text-white font-medium">Send</button> 
             </div>

         </div> 

      }

      </div>  
    );

}

export default VideoRoom;

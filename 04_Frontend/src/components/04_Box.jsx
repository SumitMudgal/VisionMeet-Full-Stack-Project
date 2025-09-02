// import 2nd component i.e. "Title"
import { useState } from "react";
import Title from "./02_Title"

// import 3rd component i.e. "Content"
import Content from './03_Content'

import { useNavigate } from "react-router-dom";


function Box(props) {

    const navigate = useNavigate();

    const isLoggedIn = props.isLoggedIn;

    const [isJoining , setIsJoining] = useState();

    const [meetingId , setMeetingId] = useState("");
    
    const [isCreating , setIsCreating] = useState();

    // on Get Started button click
    function onGetStarted() {
         navigate("/signup");
    }

    // on Join Room Click
    function onJoinClick()
    {
        setIsJoining(!isJoining);
        setIsCreating(false);
    }

    // on Create Room Click
    function onCreateClick()
    {
        setIsCreating(!isCreating);
        setIsJoining(false);
    }

    // onChange of Meeting Id
    function onMeetingIdChange(event)
    {
        setMeetingId(event.target.value);
    }

    // On join Meeting Click
    function onJoinMeeting()
    {
        navigate(`/video/${meetingId}`);
    }

    return(
        <div className="box flex-col content-center mt-40">
            <Title></Title>
            <br /> <br /> <br />
            <Content></Content>
            <br /><br />
            {isLoggedIn == false ? 
              <button onClick={onGetStarted} className="bg-amber-400 rounded-md h-8 w-30 mr-8 mt-1.5 font-medium hover:bg-amber-300  opacity-0 [animation:fadein_2s_ease_forwards] [animation-delay:1s]">Get Started</button> :

              <span className="mr-3 mt-1.5 flex flex-row gap-3 opacity-0 [animation:fadein_2s_ease_forwards] [animation-delay:1s]">
                 <button onClick={onJoinClick} className="bg-amber-400 rounded-md h-8 w-30 font-medium hover:bg-amber-500">Join Room</button>
                 <button onClick={onCreateClick} className="bg-purple-500 rounded-md h-8 w-30 font-medium hover:bg-rose-500">Create Room</button>
              </span>
            }

            {
                (isJoining == true) &&
        
                <span>
                    <br /><br />
                    <label htmlFor="meetingId" className="text-amber-600 font-semibold text-xl">Meeting Id:-  </label>
                    <input onChange={onMeetingIdChange} type="text" name="meetingId" placeholder="Enter Meeting Id" className="bg-purple-500 rounded-md h-8"></input>
                    <br></br>
                    <button onClick={onJoinMeeting} className="bg-sky-600 hover:bg-sky-500 font-medium w-20 rounded-md ml-20 mt-5">Join</button>
                </span>
                 
            }

            {
                (isCreating == true) &&
                
                <span>
                    <br /><br />
                    <label htmlFor="meetingId" className="text-amber-600 font-semibold text-xl">Create Room Id:-  </label>
                    <input onChange={onMeetingIdChange} type="text" name="meetingId" placeholder="Enter Meeting Id" className="bg-purple-500 rounded-md h-8"></input>
                    <br></br>
                    <button onClick={onJoinMeeting} className="bg-sky-600 hover:bg-sky-500 font-medium w-20 rounded-md ml-20 mt-5">Create</button>
                </span>
                 
            }

            
            {/* Define keyframes inline i.e. tailwind Css Animation Fade property*/} 
           <style>
            {`
              @keyframes fadein {
                from { opacity: 0; transform: translateX(-30px); }
                to { opacity: 1; transform: translateX(0); }
              }
            `}
           </style>
        </div>
    )
}

export default Box;

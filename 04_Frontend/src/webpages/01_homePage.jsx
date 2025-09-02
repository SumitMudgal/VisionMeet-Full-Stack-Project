// 1st Page i.e. Home Page

// Route Path of this page will be "/" only or "/home". we will see it later.

import { useEffect } from 'react';
import { useState } from 'react';

//  import 1st Component i.e. "Navbar"
import Navbar from '../components/01_navbar'

// import 7th Component i.e. MiddleBox
import MiddleBox from '../components/07_middleBox';


function Home() {
    
    // User Already LoggedIn or Not Logic

    const [isLoggedIn, setIsLoggedIn] = useState(false);  // Not LoggedIn by default

    const [user, setUser] = useState(null); // No User at starting

    useEffect(() => {
        // fetch api "url/user/check-login" to check if User logged in or not
        const check_Login_Status = async () => {

            try {
                let token = localStorage.getItem("token");

                /* // Changing the Url from Localhost to Render Backed Url.
                let response = await fetch("http://localhost:8080/user/check-login", {
                    method: "GET",
                    headers: {
                           "Authorization": localStorage.getItem("token")
                    }
                });
                */

                let response = await fetch("https://visionmeet-full-stack-project.onrender.com/user/check-login", {
                    method: "GET",
                    headers: {
                           "Authorization": localStorage.getItem("token")
                    }
                });

                console.log(response);

                let data = await response.json();
                
                console.log(data);

                // If Response is Good i.e.  status(200)
                if(response.status == 200)
                {
                    // Set "isLoggedIn" variable to "true"
                    setIsLoggedIn(true);

                    // Set Logged In user Deatils in "user" variable
                    setUser(data.user); // We send this "user" in response in "Get Route of "/check-login" in file "01_users_routes.js" file ". 
               
                }
                else  // If any other respone, means User have to Login In
                {
                   // Set Logged In to false
                   setIsLoggedIn(false);
                   setUser(null); // Set user to NULL
                }

            }
            catch(err) {
                console.error("Error checking login:", err);
                setIsLoggedIn(false);
            }
        };

        // call this Function
        check_Login_Status();

    }, []);  // "[]" => We will do this one time only after Webpage Renders.


    return(
        <div className='home'>
            <Navbar loginStatus = {isLoggedIn} setIsLoggedIn = {setIsLoggedIn} userDetails = {user}></Navbar>
            <MiddleBox loginStatus = {isLoggedIn}></MiddleBox>
        </div>
    )
}

export default Home;

// 2nd Page i.e. "Authentication Page"

import { useNavigate } from "react-router-dom";


import { useState } from "react";

function Login_Page() {

    const [formData, setFormData] = useState({username: "", password: ""});

    const [message, setMessage] = useState("");

    // form Input Data Change Handler
    const inputChangeHandler = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value 
        });
    };

    
    const navigate = useNavigate();

    // Handle Form Submit
    const onFormSubmit = async (event) => {
        event.preventDefault();

        console.log(formData.username, formData.password);

        // Fetch the details from Database, that if the User Exists in the Database or not.
        try {

            let response = await fetch("http://localhost:8080/user/login", {
                 method: "POST",
                 // body: formData       
                 // fetch requires body to be a string when sending JSON.
                 body: JSON.stringify(formData),

                 headers: {
                  "Content-Type": "application/json"
                 }

                }
              );


            let data = await response.json();

            console.log("Response: ", response);
            console.log("login resp:", data);

            // If Login Successfull
            if(response.status == 200) {

                // Store the Token in local storage
                localStorage.setItem("token", data.token);
                // Store the Expiry of Token in local storage
                localStorage.setItem("expiry", data.expiresAt);
                
                // Update Message state variable
                setMessage(data.message);  // data.message gives "LoggedIn successfully"
                
                navigate("/");
            }
            else if(response.status == 401)
            {
                // data.message gives "Wrong Password Entered".
                setMessage(data.message);
            }
        }
        catch(error) {
            console.log(error);
        };
            
    };


    // On SignUp button Click
    function onSignUp() {
        navigate("/signup");
    };


    return(
        <div className="auth flex flex-col justify-center items-center min-h-screen mt-[-60px] px-4">
            
            <div className="flex flex-col items-center justify-center">
                <h2 className=" dark:text-sky-300 text-xl sm:text-3xl md:text-5xl lg:text-7xl font-medium">
                   Login
               </h2>
            </div>
   
            <div className="flex flex-col items-center justify-center align-middle mt-15">
                <form onSubmit={onFormSubmit} className="flex flex-col gap-8 w-full max-w-md">
                {/* {!isLogin && (   // If user is "Registration Page"
                    <>
                       <label htmlFor="name" className="text-white">Name:</label>
                       <input onChange={inputChangeHandler} value={formData.name} type="text" placeholder="Enter Full Name" name="name" required  className="text-white"></input>
                    </>
                )} */}
                
                <div className="flex flex-row gap-4">
                    <label htmlFor="username" className="text-white mt-0.5 text-2xl font-medium">Username:</label>
                    <input onChange={inputChangeHandler} value={formData.username} type="text" name="username" placeholder="Enter username" required  className="text-black font-bold bg-cyan-100 w-50 sm:w-80 h-10 rounded-xl"></input>
                </div>
                 
                <div className="flex flex-row gap-4">
                    <label htmlFor="password" className="text-white mt-0.5 text-2xl font-medium">Password:</label>
                    <input onChange={inputChangeHandler} value={formData.password} type="password" name="password" placeholder="Enter Password" required  className="text-black font-bold bg-cyan-100 w-55 sm:w-80 h-10 rounded-xl"></input>
                </div>

                <div className="flex flex-row justify-center">
                    <button className="text-white font-medium bg-amber-500 w-18 h-10 rounded-md hover:bg-amber-700">
                      Login
                    </button>
                </div>

                <br />

                {message && (
                  <p className="text-center mt-2 text-lg font-bold text-red-500">
                     {message}
                  </p>
                )}

                <div className="flex flex-row gap-10 justify-center">
                  <p className="text-green-600 text-lg font-bold mt-1">Don't have an account!</p>
                  <button type="button" onClick={onSignUp} className="text-white font-medium bg-green-700 w-18 h-10 rounded-md hover:bg-green-800">
                    SignUp
                  </button> 

                </div> 

            </form>
            </div>
        </div>
    )
}

export default Login_Page;




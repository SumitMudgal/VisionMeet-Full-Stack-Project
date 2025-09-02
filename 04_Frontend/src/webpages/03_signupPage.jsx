// 3rd Page i.e. "SignUp" i.e. "Register" Page

import { useNavigate } from "react-router-dom";


import { useState } from "react";

function SignUp_Page() {

    const [formData, setFormData] = useState({name: "", username: "", password: ""});

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

        console.log(formData.name, formData.username, formData.password);

        // Fetch the Backend Api "route" of signUp i.e. "01_new_user_register"
        try {

            let response = await fetch("http://localhost:8080/user/register", {
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
            if(response.status == 201) {
                
                // Update Message state variable
                setMessage(data.message);  // data.message gives "LoggedIn successfully"
                
                navigate("/login");
            }
            else if(response.status == 400)
            {
                // data.message gives "User Already exists".
                setMessage(data.message);
            }
        }
        catch(error) {
            console.log(error);
            setMessage("Something went wrong!");
        };
            
    };


    // On Login button Click
    function onLogin() {
        navigate("/login");
    };


    return(
        <div className="auth flex flex-col justify-center items-center min-h-screen mt-[-60px] px-4">
            
            <div className="flex flex-col items-center justify-center">
                <h2 className="text-lg dark:text-sky-300 md:text-5xl lg:text-7xl font-medium">
                   SignUp
               </h2>
            </div>
   
            <div className="flex flex-col sm:items-center sm:justify-center sm:align-middle mt-15">
                <form onSubmit={onFormSubmit} className="flex flex-col gap-8 w-full max-w-md">
                
                 <div className="flex flex-row gap-4">
                    <label htmlFor="name" className="text-white mt-0.5 text-2xl font-medium">Name:</label>
                    <input onChange={inputChangeHandler} value={formData.name} type="text" name="name" placeholder="Enter name" required  className="text-black font-bold bg-cyan-100 w-60 sm:w-80 h-10 rounded-xl"></input>
                </div>
                
                <div className="flex flex-row gap-4">
                    <label htmlFor="username" className="text-white mt-0.5 text-2xl font-medium">Username:</label>
                    <input onChange={inputChangeHandler} value={formData.username} type="text" name="username" placeholder="Enter username" required  className="text-black font-bold bg-cyan-100 w-55 sm:w-80 h-10 rounded-xl"></input>
                </div>
                 
                <div className="flex flex-row gap-4">
                    <label htmlFor="password" className="text-white mt-0.5 text-2xl font-medium">Password:</label>
                    <input onChange={inputChangeHandler} value={formData.password} type="password" name="password" placeholder="Enter Password" required minLength={1} className="text-black font-bold bg-cyan-100 w-50 sm:w-80 h-10 rounded-xl"></input>
                </div>

                <div className="flex flex-row justify-center">
                    <button className="text-white font-medium bg-amber-500 w-18 h-10 rounded-md hover:bg-amber-700">
                      Sign Up
                    </button>
                </div>

                <br />

                {message && (
                  <p className="text-center mt-2 text-lg font-bold text-red-500">
                     {message}
                  </p>
                )}

                <div className="flex flex-row gap-10 justify-center">
                  <p className="text-green-600 text-lg font-bold mt-1">Already have an account!</p>
                  <button type="button" onClick={onLogin} className="text-white font-medium bg-green-700 w-18 h-10 rounded-md hover:bg-green-800">
                    Login
                  </button> 

                </div> 

            </form>
            </div>
        </div>
    )
}

export default SignUp_Page;







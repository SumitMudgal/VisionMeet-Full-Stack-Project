// 1st Component i.e. "Navbar"


import { useNavigate } from "react-router-dom";

function Navbar(props) {
    
    const isLoggedIn = props.loginStatus;

    // Parent Update "setIsLoggedIn" status
    const setIsLoggedIn = props.setIsLoggedIn;

    const userDetails = props.userDetails;

    const navigate = useNavigate();

    // Login Button OnClick function
    function onLogin() {
         navigate("/login");
    }

    // on Join As Guest click
    function onJoinAsGuest() {
        navigate("/video/123");
    }

    // logout button OnClick function
    const onLogout = async () => {

        try {
            // get the Current Token stored in LacalStorage by name "token"
            const token = localStorage.getItem("token");
            
            // Call the "logout" Api
            await fetch("https://visionmeet-full-stack-project.onrender.com/user/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${token}`
                }
            });

            // Clear the Current token from localStorage
            localStorage.removeItem("token");

            // Update "isLoggedIn" HomePaage Variable status
            setIsLoggedIn(false);
            
            // Redirect to Home page again
            navigate("/");
            
        }
        catch(error) {
            console.error("Logout failed:", error);
        }

    };



    return(
        <div className="navbar flex flex-row h-11 gap-6 justify-end content-center">
            { (isLoggedIn == false) ?
            <button onClick={onJoinAsGuest} className="text-amber-100 font-medium hover:text-amber-300 cursor-pointer">Join as Guest</button> :
            <button className="text-amber-100 font-medium hover:text-amber-300 cursor-pointer">Help</button>
            }
            <button className="text-amber-100 font-medium hover:text-amber-300 cursor-pointer">About</button>
            {isLoggedIn == false ?
             <button onClick={onLogin} className="bg-amber-400 rounded-md h-8 w-20 mr-8 mt-1.5 font-medium hover:bg-amber-300">Login</button> :
             <button onClick={onLogout} className="bg-amber-400 rounded-md h-8 w-20 mr-8 mt-1.5 font-medium hover:bg-amber-300">Logout</button>
            }

        </div>
    )
}

export default Navbar;








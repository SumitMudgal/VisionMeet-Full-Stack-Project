import './App.css'

//  import 1st Component i.e. "Navbar"
import Navbar from './components/01_navbar'

// import 4th Component i.e. Box
// import Box from "./components/04_Box"

// import 7th Component i.e. MiddleBox
import MiddleBox from './components/07_middleBox'

// Importing Routes and Routes
import { Routes } from 'react-router-dom'
import { Route } from 'react-router-dom'


// Importing 1st Page i.e Home Page "/"
import Home from './webpages/01_homePage'

// Importing 2nd page i.e. Login Page "/login"
import Login_Page from './webpages/02_loginPage'

// Importing 3rd page i.e. SignUp Page "/signup"
import SignUpPage from './webpages/03_signupPage'

// Import 4th page i.e "VideoRoom" page
import VideoRoom from './webpages/04_VideoRoom'

function App() {

  return (
    <>
       <Routes>
          {/* Path = "/" =>  1st Page i.e. Home Page */}
          <Route path='/' element={<Home></Home>}></Route>
          
          <Route path="/login" element={<Login_Page></Login_Page>}></Route>
       
          <Route path='/signup' element={<SignUpPage></SignUpPage>}></Route>
       
          {/* New Route for "Video Meeting Rooms" */}

           <Route path="/video/:roomId" element={<VideoRoom></VideoRoom>}></Route>

       </Routes>
    </>
  )
}

export default App

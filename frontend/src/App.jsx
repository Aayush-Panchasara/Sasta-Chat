import React, { useEffect } from 'react'
import Navbar from './component/Navbar.jsx'
import { useAuthStore } from './store/useAuthStore.js'
import {Loader} from "lucide-react"
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Homepage from "./pages/Homepage.jsx";
import Loginpage from "./pages/Loginpage.jsx";
import Settingpage from "./pages/Settingpage.jsx";
import Signuppage from "./pages/Signuppage.jsx";
import Profilepage from "./pages/Profilepage.jsx";
import {Toaster} from "react-hot-toast"
import { useThemeStore } from './store/useThemeStore.js'

function App() {

  const { userData, checkUser, isCheckingUser } = useAuthStore();
  const navigate = useNavigate()
  const {theme} = useThemeStore()

  useEffect(() => {
    checkUser()
  }, [checkUser])
  
  console.log("UserData: ",userData);

  if(isCheckingUser && !userData) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }
  
  

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={userData ? <Homepage /> : <Navigate to="/login" />}
        />
        <Route 
          path="/login" 
          element={!userData? <Loginpage />:<Navigate to="/"/>} />
        <Route 
          path="/signup" 
          element={!userData?<Signuppage />:<Navigate to="/"/>} />
        <Route
          path="/setting"
          element={<Settingpage />}
        />
        <Route 
          path="/profile" 
          element={userData?<Profilepage />:<Navigate to="/login"/>} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App

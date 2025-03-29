import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/userAuthStore";
import { useEffect } from "react";
import {Loader} from "lucide-react";

const App = () => {
  const {authUser, checkAuth, isCheckingAuth} = useAuthStore(); // lấy thông tin người dùng đã xác thực từ store

  useEffect(()=>{
    checkAuth(); // kiểm tra xác thực người dùng khi ứng dụng được khởi động
  },[checkAuth]);

  console.log(authUser);

  if(isCheckingAuth && !authUser) 
    return(
    <div className="flex items-center justify-center h-screen">
      <Loader className="animate-spin" /> 
    </div> // hiển thị biểu tượng tải khi đang kiểm tra xác thực
  )
  
  return (
    <div>

      <Navbar/>

      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage/> : <Navigate to="/" />} /> 
        <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage/>} />
        <Route path="/profile" element={authUser ? <ProfilePage/>  : <Navigate to="/login" />} />

      </Routes>

    </div>
  );
}
export default App;


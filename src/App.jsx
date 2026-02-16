import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import OtpVerification from "./pages/OtpVerification";
import ResetPassword from "./pages/ResetPassword";
import MyRequests from "./pages/MyRequests";
import SavedPets from "./pages/SavedPets";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Help from "./pages/Help";
import ExplorePets from "./pages/ExplorePets";
import FindDog from "./pages/FindDog";
import FindCat from "./pages/FindCat";
import FindOtherPets from "./pages/FindOtherPets";




// Components
import Navbar from "./components/Navbar";
import DashboardLayout from "./components/DashboardLayout";
import DashboardOverview from "./components/DashboardOverview";



function App() {
  return (
    <Router>
      {/* Navbar appears on all pages */}
      <Navbar />

      <Routes>
        {/* Public pages */}
        <Route path="/" element={<LandingPage />} />
        
        <Route path="/explore-pets" element={<ExplorePets />} />
        <Route path="/find-dog" element={<FindDog/>} />
        <Route path="/find-cat" element={<FindCat/>} />
        <Route path="/find-other-pets" element={<FindOtherPets/>} />
        
       

        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<OtpVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Dashboard (protected-style layout) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="requests" element={<MyRequests />} />
          <Route path="saved-pets" element={<SavedPets />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
          <Route path="help" element={<Help />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

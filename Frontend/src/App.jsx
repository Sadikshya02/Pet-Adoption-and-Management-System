import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, Outlet, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// -------------------- User Pages --------------------
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import OtpVerification from "./pages/OtpVerification";
import ResetPassword from "./pages/ResetPassword";
import MyRequests from "./pages/MyRequests";
import SavedPets from "./pages/SavedPets";
import Notifications from "./pages/Notifications";
import Help from "./pages/Help";
import ExplorePets from "./pages/ExplorePets";
import FindDog from "./pages/FindDog";
import FindCat from "./pages/FindCat";
import FindOtherPets from "./pages/FindOtherPets";
import UserProfile from "./pages/UserProfile";
import EditProfile from "./pages/EditProfile";
import PetDetails from "./pages/PetDetails";
import PetPage from "./pages/PetPage";
import Questionnaire from "./pages/Questionnaire";
import PetMatches from "./pages/PetMatches";
import DashboardOverview from "./components/DashboardOverview";

// -------------------- Admin Pages --------------------
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminSignup from "./pages/Admin/AdminSignup";
import AdminDashboard from "./pages/Admin/Dashboard";
import Adoptions from "./pages/Admin/Adoptions";
import Users from "./pages/Admin/Users";
import AdminPets from "./pages/Admin/Pets";
import AdminReports from "./pages/Admin/Reports";

// -------------------- Components --------------------
import Navbar from "./components/Navbar";
import DashboardLayout from "./components/DashboardLayout";

const AdminGuard = ({ children }) => {
  const admin = localStorage.getItem("admin");
  if (!admin) return <Navigate to="/admin/login" replace />;
  return children;
};

const QuestionnaireGuard = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (user?._id && !user?.questionnaireCompleted) return <Navigate to="/questionnaire" replace />;
  return children;
};

const AdminLayout = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <nav className="flex flex-col gap-3 flex-1">
          <Link to="/admin"           className="hover:text-blue-600">Dashboard</Link>
          <Link to="/admin/adoptions" className="hover:text-blue-600">Adoptions</Link>
          <Link to="/admin/users"     className="hover:text-blue-600">Users</Link>
          <Link to="/admin/pets"      className="hover:text-blue-600">Pets</Link>
          <Link to="/admin/reports"   className="hover:text-blue-600">Reports</Link>
        </nav>
        <button onClick={handleLogout} className="mt-auto text-left text-red-500 hover:text-red-700 font-medium">
          Logout
        </button>
      </aside>
      <main className="flex-1 bg-gray-50 p-6">
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  // -------------------- Admin Shortcut (Ctrl + Shift + A) --------------------
  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        window.location.href = "/admin/login";
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);
  // --------------------------------------------------------------------------

  return (
    <Router>
      <Navbar />
      <Toaster />
      <Routes>
        {/* ---------------- Public Pages ---------------- */}
        <Route path="/"                element={<LandingPage />} />
        <Route path="/explore-pets"    element={<ExplorePets />} />
        <Route path="/find-dog"        element={<FindDog />} />
        <Route path="/find-cat"        element={<FindCat />} />
        <Route path="/find-other-pets" element={<FindOtherPets />} />
        <Route path="/pets/:id"        element={<PetDetails />} />
        <Route path="/petpage/:id"     element={<PetPage />} />

        {/* ---------------- Auth Pages ---------------- */}
        <Route path="/login"           element={<Login />} />
        <Route path="/signup"          element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp"      element={<OtpVerification />} />
        <Route path="/reset-password"  element={<ResetPassword />} />

        {/* ---------------- Questionnaire & Matches ---------------- */}
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="/pet-matches"   element={<PetMatches />} />

        {/* ---------------- User Dashboard ---------------- */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index                element={<DashboardOverview />} />
          <Route path="requests"      element={<MyRequests />} />
          <Route path="saved-pets"    element={<SavedPets />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile"       element={<UserProfile />} />
          <Route path="edit-profile"  element={<EditProfile />} />
          <Route path="help"          element={<Help />} />
          <Route path="pet-matches"   element={<PetMatches />} />
        </Route>

        {/* ---------------- Admin Auth ---------------- */}
        <Route path="/admin/login"  element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />

        {/* ---------------- Admin Dashboard (protected) ---------------- */}
        <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
          <Route index             element={<AdminDashboard />} />
          <Route path="adoptions"  element={<Adoptions />} />
          <Route path="users"      element={<Users />} />
          <Route path="pets"       element={<AdminPets />} />
          <Route path="reports"    element={<AdminReports />} />
        </Route>

        {/* ---------------- Catch-all ---------------- */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
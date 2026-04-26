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

// -------------------- Service Pages --------------------
import PetTipsHub from "./pages/PetTipsHub";
import PetTipDetail from "./pages/PetTipDetail";
import AddPetTip from "./pages/Admin/AddPetTip";

// -------------------- Pet Detail Page --------------------
import PetDetailPage from "./components/pets/PetDetailPage";

// -------------------- Admin Pages --------------------
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminSignup from "./pages/Admin/AdminSignup";
import AdminDashboard from "./pages/Admin/Dashboard";
import Adoptions from "./pages/Admin/Adoptions";
import Users from "./pages/Admin/Users";
import AdminPets from "./pages/Admin/Pets";
import AdminReports from "./pages/Admin/Reports";
import AdminShelter from "./pages/Admin/AdminShelter";

// -------------------- Components --------------------
import Navbar from "./components/Navbar";
import DashboardLayout from "./components/DashboardLayout";

// -------------------- Shelter --------------------
import ShelterRegister from "./pages/Shelter/ShelterRegister";
import ShelterLogin from "./pages/Shelter/ShelterLogin";
import ShelterDashboard from "./pages/Shelter/ShelterDashboard";
import ShelterOverview from "./pages/Shelter/ShelterOverview";
import ShelterPets from "./pages/Shelter/ShelterPets";
import ShelterApplications from "./pages/Shelter/ShelterApplications";
import ShelterProfile from "./pages/Shelter/ShelterProfile";
import ShelterTips from "./pages/Shelter/ShelterTips";
import { ShelterGuard } from "./pages/Shelter/ShelterDashboard";

// -------------------- Map --------------------
import ShelterMap from "./components/ShelterMap";

// -------------------- Public Shelter Pets Page --------------------  ← NEW
import ShelterPetsPublic from "./pages/Shelter/ShelterPetsPublic";           // ← NEW

// -------------------- Admin Layout --------------------
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
          <Link to="/admin" className="hover:text-orange-600">Dashboard</Link>
          <Link to="/admin/adoptions" className="hover:text-orange-600">Adoptions</Link>
          <Link to="/admin/users" className="hover:text-orange-600">Users</Link>
          <Link to="/admin/tips" className="hover:text-orange-600">Pet Tips</Link>
          <Link to="/admin/pets" className="hover:text-orange-600">Pets</Link>
          <Link to="/admin/reports" className="hover:text-orange-600">Reports</Link>
          <Link to="/admin/shelters" className="hover:text-orange-600">Shelters</Link>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto text-left text-red-500 hover:text-red-700 font-medium"
        >
          Logout
        </button>
      </aside>
      <main className="flex-1 bg-gray-50 p-6">
        <Outlet />
      </main>
    </div>
  );
};

// -------------------- Admin Guard --------------------
const AdminGuard = ({ children }) => {
  const admin = localStorage.getItem("admin");
  if (!admin) return <Navigate to="/admin/login" replace />;
  return children;
};

// -------------------- App --------------------
function App() {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        window.location.href = "/admin/login";
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <Router>
      <Navbar />
      <Toaster />

      <Routes>
        {/* ---------------- Public ---------------- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/explore-pets" element={<ExplorePets />} />
        <Route path="/find-dog" element={<FindDog />} />
        <Route path="/find-cat" element={<FindCat />} />
        <Route path="/find-other-pets" element={<FindOtherPets />} />
        <Route path="/pets/:id" element={<PetDetails />} />
        <Route path="/petpage/:id" element={<PetPage />} />
        <Route path="/pet-profile/:id" element={<PetDetailPage />} />

        {/* ---------------- Map ---------------- */}
        <Route path="/shelters/map" element={<ShelterMap />} />

        {/* ---------------- Public Shelter Pets Page ---------------- */}  {/* ← NEW */}
        <Route path="/shelter/:id/pets" element={<ShelterPetsPublic />} />  {/* ← NEW */}

        {/* ---------------- Auth ---------------- */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<OtpVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ---------------- Questionnaire ---------------- */}
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="/pet-matches" element={<PetMatches />} />

        {/* ---------------- Services ---------------- */}
        <Route path="/pet-care" element={<PetTipsHub />} />
        <Route path="/pet-care/:id" element={<PetTipDetail />} />
        <Route path="/add-tip" element={<AddPetTip />} />

        {/* ---------------- User Dashboard ---------------- */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="requests" element={<MyRequests />} />
          <Route path="saved-pets" element={<SavedPets />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="help" element={<Help />} />
          <Route path="pet-matches" element={<PetMatches />} />
        </Route>

        {/* ---------------- Admin Auth ---------------- */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />

        {/* ---------------- Admin Dashboard ---------------- */}
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="adoptions" element={<Adoptions />} />
          <Route path="users" element={<Users />} />
          <Route path="pets" element={<AdminPets />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="shelters" element={<AdminShelter />} />
        </Route>

        {/* ---------------- Shelter ---------------- */}
        <Route path="/shelter/register" element={<ShelterRegister />} />
        <Route path="/shelter/login" element={<ShelterLogin />} />

        <Route
          path="/shelter/dashboard"
          element={
            <ShelterGuard>
              <ShelterDashboard />
            </ShelterGuard>
          }
        >
          <Route index element={<ShelterOverview />} />
          <Route path="pets" element={<ShelterPets />} />
          <Route path="applications" element={<ShelterApplications />} />
          <Route path="tips" element={<ShelterTips />} />
          <Route path="profile" element={<ShelterProfile />} />
        </Route>

        {/* ---------------- Catch All ---------------- */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
import React, { useState } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  LayoutDashboard, PawPrint, User, LogOut,
  BookOpen, ClipboardList, Menu, X,
} from "lucide-react";
import ShelterNotifications from "./ShelterNotifications";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// ── Auth guard ────────────────────────────────────────────────────────────────
export const ShelterGuard = ({ children }) => {
  const navigate = useNavigate();
  const shelter  = localStorage.getItem("shelter");
  if (!shelter) {
    navigate("/shelter/login");
    return null;
  }
  return children;
};

// ── Dashboard layout ──────────────────────────────────────────────────────────
export default function ShelterDashboard() {
  const navigate = useNavigate();
  const shelter  = JSON.parse(localStorage.getItem("shelter") || "{}");
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API}/shelter-auth/logout`,
        {},
        { withCredentials: true } // ✅ sends cookie so backend can clear it
      );
    } catch (_) {
      // ignore errors on logout
    }
    localStorage.removeItem("shelter");
    toast.success("Logged out");
    navigate("/shelter/login");
  };

  const navItems = [
    { to: "/shelter/dashboard",              label: "Overview",     icon: LayoutDashboard },
    { to: "/shelter/dashboard/pets",         label: "My Pets",      icon: PawPrint        },
    { to: "/shelter/dashboard/applications", label: "Applications", icon: ClipboardList   },
    { to: "/shelter/dashboard/tips",         label: "Care Tips",    icon: BookOpen        },
    { to: "/shelter/dashboard/profile",      label: "Profile",      icon: User            },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ${
        open ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 lg:static`}>

        {/* Shelter identity */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {shelter.logo ? (
              <img src={shelter.logo} className="w-10 h-10 rounded-full object-cover" alt="logo" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xl">
                🏠
              </div>
            )}
            <div>
              <div className="font-bold text-gray-900 text-sm leading-tight">
                {shelter.organizationName}
              </div>
              <div className="text-xs text-green-600 font-semibold">● Approved</div>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/shelter/dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-orange-500 text-white"
                    : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                }`
              }
            >
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 w-full transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white border border-gray-200 rounded-xl p-2 shadow-sm"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="flex justify-end items-center px-6 lg:px-8 py-4 border-b border-gray-100 bg-white sticky top-0 z-30">
          <ShelterNotifications />
        </div>
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
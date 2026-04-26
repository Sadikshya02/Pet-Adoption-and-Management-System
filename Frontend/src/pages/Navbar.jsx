import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PawPrint, Search, ChevronDown, UserCircle, Bell, LogOut } from "lucide-react";

const Navbar = () => {
  const [findPetOpen, setFindPetOpen]     = useState(false);
  const [aboutPetsOpen, setAboutPetsOpen] = useState(false);
  const [profileOpen, setProfileOpen]     = useState(false);
  const [shelter, setShelter]             = useState(null);

  const profileRef = useRef(null);
  const navigate   = useNavigate();

  // ✅ Sync shelter state from localStorage + listen for login/logout events
  useEffect(() => {
    const syncShelter = () => {
      const stored = localStorage.getItem("shelter");
      setShelter(stored ? JSON.parse(stored) : null);
    };

    syncShelter();

    window.addEventListener("shelter-updated", syncShelter);
    window.addEventListener("storage", syncShelter);

    return () => {
      window.removeEventListener("shelter-updated", syncShelter);
      window.removeEventListener("storage", syncShelter);
    };
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("shelter");
    setShelter(null);
    setProfileOpen(false);
    window.dispatchEvent(new Event("shelter-updated"));
    navigate("/");
  };

  const toggleFindPet = () => {
    setFindPetOpen(!findPetOpen);
    setAboutPetsOpen(false);
  };

  const toggleAboutPets = () => {
    setAboutPetsOpen(!aboutPetsOpen);
    setFindPetOpen(false);
  };

  return (
    <nav className="bg-orange-500 text-white px-8 py-4 flex justify-between items-center shadow-md sticky top-0 z-50">

      {/* Logo */}
      <div className="flex items-center space-x-2 text-2xl font-bold">
        <PawPrint size={30} className="text-blue-400" />
        <span>FureverHome</span>
      </div>

      {/* Middle Section */}
      <div className="flex items-center space-x-10 relative">

        {/* Search */}
        <div className="flex items-center bg-white rounded-full px-3 py-1">
          <Search size={18} className="text-orange-500 mr-2" />
          <input
            type="text"
            placeholder="Search pets..."
            className="outline-none text-gray-700 placeholder-gray-400 w-48 bg-transparent"
          />
        </div>

        {/* Nav Links — hidden when shelter is logged in */}
        {!shelter && (
          <ul className="flex space-x-10 text-lg items-center">

            <li>
              <Link to="/" className="hover:text-gray-300 transition">
                Home
              </Link>
            </li>

            {/* FIND A PET */}
            <li className="relative">
              <button
                onClick={toggleFindPet}
                className="flex items-center gap-1 hover:text-gray-300 transition focus:outline-none"
              >
                Find a Pet <ChevronDown size={18} />
              </button>
              {findPetOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white text-orange-500 rounded-lg shadow-lg w-56">
                  <Link to="/find-by-location" className="block px-4 py-2 hover:bg-orange-100 rounded-t-lg">
                    Find by Location
                  </Link>
                  <Link to="/find-dog" className="block px-4 py-2 hover:bg-orange-100">
                    Find a Dog
                  </Link>
                  <Link to="/find-cat" className="block px-4 py-2 hover:bg-orange-100">
                    Find a Cat
                  </Link>
                  <Link to="/find-other-pets" className="block px-4 py-2 hover:bg-orange-100 rounded-b-lg">
                    Find Other Pets
                  </Link>
                </div>
              )}
            </li>

            {/* SERVICES */}
            <li className="relative">
              <button
                onClick={toggleAboutPets}
                className="flex items-center gap-1 hover:text-gray-300 transition focus:outline-none"
              >
                Services <ChevronDown size={18} />
              </button>
              {aboutPetsOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white text-orange-500 rounded-lg shadow-lg w-56">
                  <Link to="/care-tips" className="block px-4 py-2 hover:bg-orange-100 rounded-t-lg">
                    Pet Care Tips
                  </Link>
                  <Link to="/breeds" className="block px-4 py-2 hover:bg-orange-100">
                    Breeds Guide
                  </Link>
                  <Link to="/training" className="block px-4 py-2 hover:bg-orange-100">
                    Training & Behavior
                  </Link>
                  <Link to="/health" className="block px-4 py-2 hover:bg-orange-100 rounded-b-lg">
                    Health & Nutrition
                  </Link>
                </div>
              )}
            </li>

            <li>
              <Link to="/contact" className="hover:text-gray-300 transition">
                Contact
              </Link>
            </li>

          </ul>
        )}
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">

        {shelter ? (
          // ✅ SHELTER LOGGED IN — Notifications, Profile, Logout
          <>
            {/* Notifications */}
            <button
              onClick={() => navigate("/shelter/notifications")}
              className="relative text-white hover:text-gray-200 transition"
              title="Notifications"
            >
              <Bell size={26} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 hover:text-gray-200 transition"
                title="My Profile"
              >
                <UserCircle size={32} />
                <span className="text-sm font-semibold hidden sm:block">
                  {shelter.name || "Shelter"}
                </span>
                <ChevronDown size={16} />
              </button>

              {profileOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white text-gray-700 rounded-lg shadow-lg w-48 z-50">
                  <Link
                    to="/shelter/dashboard"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-orange-100 text-orange-500 font-semibold rounded-t-lg"
                  >
                    <UserCircle size={18} /> Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-orange-100 text-red-500 font-semibold rounded-b-lg"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          // ✅ NOT LOGGED IN — Profile icon + Sign In
          <>
            <button
              onClick={() => navigate("/dashboard/profile")}
              className="text-white hover:text-gray-200 transition"
              title="My Profile"
            >
              <UserCircle size={32} />
            </button>

            <Link
              to="/login"
              className="bg-white text-orange-500 px-4 py-2 rounded-lg font-semibold hover:bg-orange-100 transition"
            >
              Sign In
            </Link>
          </>
        )}
      </div>

    </nav>
  );
};

export default Navbar;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PawPrint, Search, ChevronDown, UserCircle, Sparkles } from "lucide-react";

const Navbar = () => {
  const [findPetOpen, setFindPetOpen]     = useState(false);
  const [aboutPetsOpen, setAboutPetsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleFindPet   = () => { setFindPetOpen(!findPetOpen); setAboutPetsOpen(false); };
  const toggleAboutPets = () => { setAboutPetsOpen(!aboutPetsOpen); setFindPetOpen(false); };

  const handleMatchClick = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?._id)                   return navigate("/login");
    if (!user?.questionnaireCompleted) return navigate("/questionnaire");
    navigate("/pet-matches");
  };

  return (
    <nav className="bg-orange-500 text-white px-8 py-4 flex justify-between items-center shadow-md sticky top-0 z-50">

      {/* Logo */}
      <div className="flex items-center space-x-2 text-2xl font-bold">
        <PawPrint size={30} className="text-blue-400" />
        <span>FureverHome</span>
      </div>

      {/* Middle */}
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

        <ul className="flex space-x-10 text-lg items-center">

          <li>
            <Link to="/" className="hover:text-gray-300 transition">Home</Link>
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
                <Link to="/find-other-pets" className="block px-4 py-2 hover:bg-orange-100">
                 Find Other Pets
                </Link>
                {/*  Find My Match */}
                <button
                  onClick={() => { handleMatchClick(); setFindPetOpen(false); }}
                  className="block w-full text-left px-4 py-2 hover:bg-orange-100 rounded-b-lg font-semibold text-orange-500"
                >
                 Find My Match
                </button>
              </div>
            )}
          </li>

          {/* ALL ABOUT PETS */}
          <li className="relative">
            <button
              onClick={toggleAboutPets}
              className="flex items-center gap-1 hover:text-gray-300 transition focus:outline-none"
            >
              All About Pets <ChevronDown size={18} />
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
            <Link to="/services" className="hover:text-gray-300 transition">Services</Link>
          </li>

          <li>
            <Link to="/contact" className="hover:text-gray-300 transition">Contact</Link>
          </li>

        </ul>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/*  My Matches button */}
        <button
          onClick={handleMatchClick}
          className="flex items-center gap-1 bg-white text-orange-500 px-3 py-2 rounded-lg font-semibold hover:bg-orange-100 transition text-sm"
        >
          <Sparkles size={16} /> My Matches
        </button>

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
      </div>

    </nav>
  );
};

export default Navbar;
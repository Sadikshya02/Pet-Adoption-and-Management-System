import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PawPrint, Search, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [findPetOpen, setFindPetOpen] = useState(false);
  const [allAboutOpen, setAllAboutOpen] = useState(false);

  return (
    <nav className="bg-orange-500 text-white px-8 py-4 flex justify-between items-center shadow-md">
      
      {/* Left side - Logo */}
      <div className="flex items-center space-x-2 text-2xl font-bold">
        <PawPrint size={30} className="text-blue-400" />
        <span>FureverHome</span>
      </div>

      {/* Middle - Search + Navigation Links */}
      <div className="flex items-center space-x-10">
        
        {/* Search bar */}
        <div className="flex items-center bg-white rounded-full px-3 py-1 mr-4">
          <Search size={18} className="text-orange-500 mr-2" />
          <input
            type="text"
            placeholder="Search pets..."
            className="outline-none text-gray-700 placeholder-gray-400 w-48 bg-transparent"
          />
        </div>

        {/* Navigation Links */}
        <ul className="flex space-x-12 text-lg relative">

          <li>
            <Link to="/" className="hover:text-gray-200 transition">Home</Link>
          </li>

          {/* Find a Pet Dropdown */}
          <li className="relative">
            <button
              onClick={() => setFindPetOpen(!findPetOpen)}
              className="flex items-center gap-1 hover:text-gray-200 transition"
            >
              Find a Pet <ChevronDown size={16} />
            </button>

            {findPetOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white text-orange-500 rounded-lg shadow-lg w-48 z-50">
                <Link
                  to="/find-dogs"
                  className="block px-4 py-2 hover:bg-orange-100"
                  onClick={() => setFindPetOpen(false)}
                >
                  🐶 Find a Dog
                </Link>
                <Link
                  to="/find-cats"
                  className="block px-4 py-2 hover:bg-orange-100"
                  onClick={() => setFindPetOpen(false)}
                >
                  🐱 Find a Cat
                </Link>
                <Link
                  to="/find-other-pets"
                  className="block px-4 py-2 hover:bg-orange-100"
                  onClick={() => setFindPetOpen(false)}
                >
                  🐾 Find Other Pets
                </Link>
              </div>
            )}
          </li>

          {/* All About Pets Dropdown (optional) */}
          <li className="relative">
            <button
              onClick={() => setAllAboutOpen(!allAboutOpen)}
              className="flex items-center gap-1 hover:text-gray-200 transition"
            >
              All About Pets <ChevronDown size={16} />
            </button>

            {allAboutOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white text-orange-500 rounded-lg shadow-lg w-48 z-50">
                <Link
                  to="/pet-care"
                  className="block px-4 py-2 hover:bg-orange-100"
                  onClick={() => setAllAboutOpen(false)}
                >
                  🩺 Pet Care
                </Link>
                <Link
                  to="/pet-behavior"
                  className="block px-4 py-2 hover:bg-orange-100"
                  onClick={() => setAllAboutOpen(false)}
                >
                  🐕 Behavior Tips
                </Link>
              </div>
            )}
          </li>

          <li>
            <Link to="/contact" className="hover:text-gray-200 transition">Contact</Link>
          </li>
        </ul>
      </div>

      {/* Right side - Sign In */}
      <div>
        <Link
          to="/signin"
          className="bg-white text-orange-500 px-4 py-2 rounded-lg font-semibold hover:bg-orange-100 transition"
        >
          Sign In
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

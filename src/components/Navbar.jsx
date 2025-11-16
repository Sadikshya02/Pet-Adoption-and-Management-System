import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PawPrint, Search } from "lucide-react"; // 🐾 + 🔍 icons

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-orange-500 text-white px-8 py-4 flex justify-between items-center shadow-md sticky top-0 z-50">
      
      {/* Left side - Paw + Logo */}
      <div className="flex items-center space-x-2 text-2xl font-bold">
        <PawPrint size={30} className="text-blue-400" />
        <span>FureverHome</span>
      </div>

      {/* Middle - Search + Navigation Links (desktop) */}
      <div className="hidden md:flex items-center space-x-10">
        {/* Search bar */}
        <div className="flex items-center bg-white rounded-full px-3 py-1">
          <Search size={18} className="text-orange-500 mr-2" />
          <input
            type="text"
            placeholder="Search pets..."
            className="outline-none text-gray-700 placeholder-gray-400 w-48 bg-transparent"
          />
        </div>

        {/* Navigation Links */}
        <ul className="flex space-x-12 text-lg">
          <li>
            <Link to="/" className="hover:text-gray-400 transition">
              Home
            </Link>
          </li>
          <li>
            <Link to="/AdoptionInfo" className="hover:text-gray-400 transition">
              Adoption Information
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-gray-400 transition">
              About
            </Link>
          </li>
          <li>
            <Link to="/services" className="hover:text-gray-400 transition">
              Services
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-gray-400 transition">
              Contact
            </Link>
          </li>
        </ul>
      </div>

      {/* Right side - Sign In */}
      <div className="hidden md:block">
        <Link
          to="/signin"
          className="bg-white text-orange-500 px-4 py-2 rounded-lg font-semibold hover:bg-orange-100 transition"
        >
          Sign In
        </Link>
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center">
        <button onClick={() => setIsOpen(!isOpen)}>
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-orange-500 px-6 pb-4 flex flex-col space-y-3">
          <Link to="/" className="flex items-center text-white hover:text-gray-300 transition" onClick={() => setIsOpen(false)}>
            <PawPrint className="mr-2" /> FureverHome
          </Link>

          {/* Search bar */}
          <div className="flex items-center bg-white rounded-full px-3 py-1">
            <Search size={18} className="text-orange-500 mr-2" />
            <input
              type="text"
              placeholder="Search pets..."
              className="outline-none text-gray-700 placeholder-gray-400 w-full bg-transparent"
            />
          </div>

          {/* Links */}
          <Link to="/" className="text-white hover:text-gray-300 transition" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link to="/AdoptionInfo" className="text-white hover:text-gray-300 transition" onClick={() => setIsOpen(false)}>
            Adoption Information
          </Link>
          <Link to="/about" className="text-white hover:text-gray-300 transition" onClick={() => setIsOpen(false)}>
            About
          </Link>
          <Link to="/services" className="text-white hover:text-gray-300 transition" onClick={() => setIsOpen(false)}>
            Services
          </Link>
          <Link to="/contact" className="text-white hover:text-gray-300 transition" onClick={() => setIsOpen(false)}>
            Contact
          </Link>

          {/* Sign In button */}
          <Link
            to="/signin"
            className="bg-white text-orange-500 px-4 py-2 rounded-lg font-semibold hover:bg-orange-100 transition"
            onClick={() => setIsOpen(false)}
          >
            Sign In
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

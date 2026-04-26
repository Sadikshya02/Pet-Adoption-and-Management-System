import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PawPrint, Search, ChevronDown, UserCircle, User, Home, ShieldCheck } from "lucide-react";

const Navbar = () => {
  const [findPetOpen, setFindPetOpen] = useState(false);
  const [signInOpen, setSignInOpen]   = useState(false);
  const navigate = useNavigate();
  const signInRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (signInRef.current && !signInRef.current.contains(e.target)) {
        setSignInOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const roles = [
    {
      label:  "Sign in as User",
      sub:    "Adopt & explore pets",
      path:   "/login",
      icon:   <User size={16} />,
      iconBg: "bg-orange-100 text-orange-600",
    },
    {
      label:  "Sign in as Shelter",
      sub:    "Manage your shelter",
      path:   "/shelter/login",
      icon:   <Home size={16} />,
      iconBg: "bg-blue-100 text-blue-600",
    },
    {
      label:  "Sign in as Admin",
      sub:    "Platform management",
      path:   "/admin/login",
      icon:   <ShieldCheck size={16} />,
      iconBg: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <nav className="bg-orange-500 text-white px-8 py-4 flex justify-between items-center shadow-md sticky top-0 z-50">

      {/* Logo */}
      <div className="flex items-center space-x-2 text-2xl font-bold">
        <PawPrint size={30} className="text-white" />
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

        {/* Nav Links */}
        <ul className="flex space-x-10 text-lg items-center">
          <li>
            <Link to="/" className="hover:text-gray-300 transition">Home</Link>
          </li>

          {/* Find a Pet dropdown */}
          <li className="relative">
            <button
              onClick={() => setFindPetOpen(!findPetOpen)}
              className="flex items-center gap-1 hover:text-gray-300 transition focus:outline-none"
            >
              Find a Pet <ChevronDown size={18} />
            </button>
            {findPetOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white text-orange-500 rounded-lg shadow-lg w-56">
                <Link to="/find-by-location" className="block px-4 py-2 hover:bg-orange-100 rounded-t-lg">Find by Location</Link>
                <Link to="/find-dog"         className="block px-4 py-2 hover:bg-orange-100">Find a Dog</Link>
                <Link to="/find-cat"         className="block px-4 py-2 hover:bg-orange-100">Find a Cat</Link>
                <Link to="/find-other-pets"  className="block px-4 py-2 hover:bg-orange-100 rounded-b-lg">Find Other Pets</Link>
              </div>
            )}
          </li>

          <li>
            <Link to="/pet-care" className="hover:text-gray-300 transition">Services</Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-gray-300 transition">Contact</Link>
          </li>
        </ul>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/dashboard/profile")}
          className="text-white hover:text-gray-200 transition"
          title="My Profile"
        >
          <UserCircle size={32} />
        </button>

        {/* Role Switcher */}
        <div className="relative" ref={signInRef}>
          <button
            onClick={() => setSignInOpen(!signInOpen)}
            className="flex items-center gap-1.5 bg-white text-orange-500 px-4 py-2 rounded-lg font-semibold hover:bg-orange-100 transition"
          >
            Sign In
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${signInOpen ? "rotate-180" : ""}`}
            />
          </button>

          {signInOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">

              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sign in as</p>
              </div>

              {roles.map((role) => (
                <Link
                  key={role.path}
                  to={role.path}
                  onClick={() => setSignInOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition group"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${role.iconBg}`}>
                    {role.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-orange-600 transition">
                      {role.label}
                    </p>
                    <p className="text-xs text-gray-400">{role.sub}</p>
                  </div>
                </Link>
              ))}

              <div className="border-t border-gray-100 px-4 py-3">
                <Link
                  to="/shelter/register"
                  onClick={() => setSignInOpen(false)}
                  className="flex items-center gap-2 text-xs font-semibold text-orange-500 hover:text-orange-700 transition"
                >
                  <span>🏠</span> Register your shelter
                </Link>
              </div>

            </div>
          )}
        </div>
      </div>

    </nav>
  );
};

export default Navbar;
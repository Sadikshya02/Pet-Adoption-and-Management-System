import React from "react";
import { Link } from "react-router-dom";
import { PawPrint } from "lucide-react";
import { FaGoogle, FaFacebookF, FaInstagram } from "react-icons/fa";

const Signup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300 p-6">
      
      {/* Container */}
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl flex overflow-hidden">
        
        {/* Left Side - Text */}
        <div className="w-1/2 flex flex-col justify-center items-center p-10 bg-white">
          <PawPrint size={50} className="text-orange-500 mb-4" />
          <h2 className="text-3xl font-bold text-orange-600 mb-4 bg-white p-2 rounded-md">
            Join FureverHome!
          </h2>
          <p className="text-gray-700 text-center">
            Create an account and take the first step toward finding your new furry friend.
            Your furever companion is waiting!
          </p>
        </div>

        {/* Right Side - Form */}
        <div className="w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-orange-600 mb-6">Sign Up</h2>
          <form className="flex flex-col space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="Create a password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <button
              type="submit"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
            >
              Sign Up
            </button>
          </form>

          {/* Social Auth Buttons */}
          <div className="mt-6">
            <p className="text-gray-600 text-center mb-3">Or sign up using</p>
            <div className="flex justify-center space-x-4">
              <button className="w-12 h-12 flex items-center justify-center bg-white border border-gray-300 rounded-full shadow hover:bg-gray-100 transition">
                <FaGoogle className="text-red-500 w-6 h-6" />
              </button>
              <button className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition">
                <FaFacebookF className="w-6 h-6" />
              </button>
              <button className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-full shadow hover:opacity-90 transition">
                <FaInstagram className="w-6 h-6" />
              </button>
            </div>
          </div>

          <p className="text-gray-600 mt-6 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-500 hover:underline">
              Log in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Signup;

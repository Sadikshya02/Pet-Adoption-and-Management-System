import React from "react";
import { Link } from "react-router-dom";
import { PawPrint } from "lucide-react";

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300 p-6">
      
      {/* Container */}
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-10">
        <div className="flex flex-col items-center">
          <PawPrint size={50} className="text-orange-500 mb-4" />
          <h2 className="text-3xl font-bold text-orange-600 mb-2">Forgot Password?</h2>
          <p className="text-gray-700 text-center mb-6">
            No worries! Enter your email, and we’ll send you a link to reset your password.
          </p>

          {/* Forgot Password Form */}
          <form className="flex flex-col space-y-4 w-full">
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <button
              type="submit"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition w-full"
            >
              Send Reset Link
            </button>
          </form>

          <p className="text-gray-600 mt-6 text-center">
            Remembered your password?{" "}
            <Link to="/login" className="text-orange-500 hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

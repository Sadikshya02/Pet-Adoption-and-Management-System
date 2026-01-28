import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { PawPrint } from "lucide-react";
import axios from "axios";
import RESET from "../assets/resetpassword.png";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // new state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    if (!newPassword) {
      setError("Please enter a new password");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/auth/reset-password",
        { email, newPassword }
      );

      alert(data.message);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-100 p-6">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl flex overflow-hidden">
        {/* Left Image */}
        {/* Left Image */}
<div className="w-1/2 hidden md:block">
  <img
    src={RESET}
    alt="Reset Password"
    className="w-full h-full object-cover"
  />
</div>


        {/* Right Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <div className="flex flex-col items-center">
            <PawPrint size={50} className="text-orange-500 mb-4" />
            <h2 className="text-3xl font-bold text-orange-600 mb-2">
              Reset Password
            </h2>
            <p className="text-gray-700 text-center mb-6">
              Set a new password for your account.
            </p>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form className="flex flex-col space-y-4 w-full" onSubmit={handleReset}>
              <div>
                <label className="block text-gray-700 mb-1">New Password</label>
                <input
                  type={showPassword ? "text" : "password"} // toggle type
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {/* Show password checkbox */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showPassword"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  className="w-4 h-4"
                />
                <label htmlFor="showPassword" className="text-gray-700 text-sm">
                  Show Password
                </label>
              </div>

              <button
                type="submit"
                className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition w-full"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>

            <p className="text-gray-600 mt-6 text-center text-sm">
              <Link to="/login" className="text-orange-500 hover:underline">
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

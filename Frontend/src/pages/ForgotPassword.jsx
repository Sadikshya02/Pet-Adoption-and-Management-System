import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PawPrint } from "lucide-react";
import axios from "axios";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/auth/send-otp",
        { email }
      );
      alert(data.message);
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-100 p-6">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl flex overflow-hidden">
        {/* Left Image */}
        <div className="w-1/2 hidden md:block">
          <img
            src="src/assets/forgot-password.avif"
            
            alt="Friendly Pet"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <div className="flex flex-col items-center">
            <PawPrint size={50} className="text-orange-500 mb-4" />
            <h2 className="text-3xl font-bold text-orange-600 mb-2">
              Forgot Password?
            </h2>
            <p className="text-gray-700 text-center mb-6">
              Enter your email to receive an OTP for password reset.
            </p>

            {error && <p className="text-red-500 mb-2">{error}</p>}

            <form className="flex flex-col space-y-4 w-full" onSubmit={handleSendOtp}>
              <div>
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition w-full"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
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
    </div>
  );
};

export default ForgotPassword;

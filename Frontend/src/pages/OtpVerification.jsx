import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { PawPrint } from "lucide-react";
import axios from "axios";
import otpImage from "../assets/OTPimage.jpg"; // make sure the file exists in src/assets

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/auth/verify-otp",
        { email, otp }
      );

      if (data.message === "OTP verified successfully") {
        alert(data.message);
        navigate("/reset-password", { state: { email } });
      } else {
        setError(data.message);
      }
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
            src={otpImage}
            alt="OTP Illustration"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <div className="flex flex-col items-center w-full">
            <PawPrint size={50} className="text-orange-500 mb-4" />
            <h2 className="text-3xl font-bold text-orange-600 mb-2">Enter OTP</h2>
            <p className="text-gray-700 text-center mb-6">
              We have sent a 6-digit OTP to <span className="font-semibold">{email}</span>.
            </p>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form className="flex flex-col space-y-4 w-full" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-700 mb-1">OTP</label>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <button
                type="submit"
                className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition w-full"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>

            <p className="text-gray-600 mt-6 text-center text-sm">
              Didn't receive the OTP?{" "}
              <button className="text-orange-500 hover:underline" disabled={loading}>
                Resend OTP
              </button>
            </p>

            <p className="text-gray-600 mt-2 text-center text-sm">
              <Link to="/login" className="text-orange-500 hover:underline">
                Go back to Login
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VerifyOtp;

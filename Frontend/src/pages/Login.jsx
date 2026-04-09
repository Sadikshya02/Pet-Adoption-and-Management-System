import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PawPrint, Eye, EyeOff } from "lucide-react"; 
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData]         = useState({ email: "", password: "" });
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [showPassword, setShowPassword] = useState(false); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/auth/login",
        formData,
        { withCredentials: true }
      );

      if (data.success) {
        localStorage.removeItem("user");
        localStorage.setItem("user", JSON.stringify(data.user));

        if (!data.user?.questionnaireCompleted) {
          navigate("/questionnaire");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300 p-6">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl flex overflow-hidden">

        {/* Left */}
        <div className="w-1/2 flex flex-col justify-center items-center p-10">
          <PawPrint size={50} className="text-orange-500 mb-4" />
          <h2 className="text-3xl font-bold text-orange-600 mb-4">Welcome Back!</h2>
          <p className="text-gray-700 text-center">
            Login to continue exploring pets and find your perfect companion.
          </p>
        </div>

        {/* Right */}
        <div className="w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-orange-600 mb-6">Login</h2>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/*  Password field with show/hide toggle */}
            <div>
              <label className="block text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-orange-500 hover:underline">
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-gray-600 mt-6 text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-orange-500 hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
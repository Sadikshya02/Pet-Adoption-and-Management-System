import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PawPrint } from "lucide-react";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "", email: "", address: "", phone: "", password: "", confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) return setError("Name is required");
    if (!emailRegex.test(formData.email)) return setError("Invalid email format");
    if (!phoneRegex.test(formData.phone)) return setError("Phone must be 10 digits");
    if (!passwordRegex.test(formData.password))
      return setError("Password must be at least 8 characters and include uppercase, lowercase and number");
    if (formData.password !== formData.confirmPassword)
      return setError("Passwords do not match");

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        address: formData.address,
        phoneNumber: formData.phone,
      };

      const { data } = await axios.post(
        "http://localhost:4000/api/auth/register",
        payload,
        { withCredentials: true }
      );

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/questionnaire");
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
        <div className="w-1/2 flex flex-col justify-center items-center p-10 text-center">
          <PawPrint size={50} className="text-orange-500 mb-4" />
          <h2 className="text-3xl font-bold text-orange-600 mb-4">Join FureverHome!</h2>
          <p className="text-gray-700 text-lg">
            Create an account and take the first step toward finding your new furry friend.
          </p>
        </div>

        {/* Right */}
        <div className="w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-orange-600 mb-6">Sign Up</h2>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            {["name", "email", "address", "phone", "password", "confirmPassword"].map((field) => (
              <div key={field}>
                <label className="block text-gray-700 mb-1">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field.includes("password") ? "password" : field === "phone" ? "tel" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={field === "confirmPassword" ? "Confirm Password" : `Enter your ${field}`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <p className="text-gray-600 mt-6 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-500 hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
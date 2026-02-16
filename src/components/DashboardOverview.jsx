import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import StatCard from "./StatCard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const SOCKET_URL = "http://localhost:5000"; // Backend Socket.IO URL

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    applied: 0,
    approved: 0,
    pending: 0,
    saved: 0,
  });

  const [adoptionTrends, setAdoptionTrends] = useState([]);
  const [petCategories, setPetCategories] = useState([]);

  const COLORS = [
    "#FFA500",
    "#FFB347",
    "#FFCC99",
    "#FFD699",
    "#FFAA33",
    "#FF8C42",
    "#FF7043",
  ];

  useEffect(() => {
    // Connect to Socket.IO
    const socket = io(SOCKET_URL, {
      auth: {
        token: localStorage.getItem("token"), // Optional JWT
      },
    });

    // 📊 Stats update
    socket.on("dashboard_stats", (data) => {
      setStats(data);
    });

    // 📈 Adoption trends update
    socket.on("adoption_trends", (data) => {
      setAdoptionTrends(data);
    });

    // 🐾 Pet categories update
    socket.on("pet_categories", (data) => {
      // Fill empty categories if some are missing
      const categoriesMap = {};
      data.forEach((c) => (categoriesMap[c.name] = c.value));
      const allCategories = ["Dogs", "Cats", "Rabbits", "Birds", "Guinea pigs", "Other"];
      setPetCategories(
        allCategories.map((name) => ({
          name,
          value: categoriesMap[name] || 0,
        }))
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* Stats cards */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-semibold text-gray-800">
          Welcome back 👋
        </h1>
        <p className="text-gray-500 mt-1">Here’s your real-time dashboard overview</p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Pets Applied" value={stats.applied} icon="🐾" />
          <StatCard title="Approved Adoptions" value={stats.approved} icon="✅" />
          <StatCard title="Pending Requests" value={stats.pending} icon="⏳" />
          <StatCard title="Saved Pets" value={stats.saved} icon="❤️" />
        </div>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly adoptions */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Monthly Adoptions</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={adoptionTrends}>
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line dataKey="adoptions" stroke="#FFA500" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pet categories */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Pet Categories</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={petCategories}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {petCategories.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;

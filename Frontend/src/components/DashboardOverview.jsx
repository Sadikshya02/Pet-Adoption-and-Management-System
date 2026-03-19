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
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";

const SOCKET_URL = "http://localhost:5000";

// Dummy Data laaa pachi change hannu yellai Acutal data le replace backend ra DB sanga communicate hanera  

const dummyAdoptionTrends = [
  { month: "Aug", adoptions: 4 },
  { month: "Sep", adoptions: 7 },
  { month: "Oct", adoptions: 5 },
  { month: "Nov", adoptions: 10 },
  { month: "Dec", adoptions: 8 },
  { month: "Jan", adoptions: 13 },
  { month: "Feb", adoptions: 11 },
];

const dummyApplicationStatus = [
  { status: "Pending", count: 8 },
  { status: "Submitted", count: 15 },
  { status: "Approved", count: 6 },
];

const dummyPetCategories = [
  { name: "Dogs", value: 40 },
  { name: "Cats", value: 30 },
  { name: "Rabbits", value: 12 },
  { name: "Birds", value: 10 },
  { name: "Guinea Pigs", value: 5 },
  { name: "Other", value: 3 },
];

// Colour ya bata change hannu

const COLORS = [
  "#FFA500",
  "#FFB347",
  "#FFCC99",
  "#FFD699",
  "#FFAA33",
  "#FF8C42",
];

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    applied: 0,
    approved: 0,
    pending: 0,
    saved: 0,
  });

  const [adoptionTrends, setAdoptionTrends] = useState(dummyAdoptionTrends);
  const [petCategories, setPetCategories] = useState(dummyPetCategories);
  const [applicationStatus, setApplicationStatus] = useState(dummyApplicationStatus);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      auth: { token: localStorage.getItem("token") },
    });

    socket.on("dashboard_stats", (data) => setStats(data));

    socket.on("adoption_trends", (data) => {
      if (data && data.length > 0) setAdoptionTrends(data);
    });

    socket.on("pet_categories", (data) => {
      if (data && data.length > 0) {
        const categoriesMap = {};
        data.forEach((c) => (categoriesMap[c.name] = c.value));
        const allCategories = ["Dogs", "Cats", "Rabbits", "Birds", "Guinea Pigs", "Other"];
        setPetCategories(
          allCategories.map((name) => ({
            name,
            value: categoriesMap[name] || 0,
          }))
        );
      }
    });

    socket.on("application_status", (data) => {
      if (data && data.length > 0) setApplicationStatus(data);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* Header + Stat Cards */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-semibold text-gray-800">Welcome back 👋</h1>
        <p className="text-gray-500 mt-1">Here's your real-time dashboard overview</p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Pets Applied" value={stats.applied} icon="🐾" />
          <StatCard title="Approved Adoptions" value={stats.approved} icon="✅" />
          <StatCard title="Pending Requests" value={stats.pending} icon="⏳" />
          <StatCard title="Saved Pets" value={stats.saved} icon="❤️" />
        </div>
      </div>

      {/* Row 1: Adoption Rate (Line) + Application Status (Bar) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 📈 Adoption Rate — Line Chart */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-1 text-gray-800">Adoption Rate</h2>
          <p className="text-sm text-gray-400 mb-4">Monthly adoptions over time</p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={adoptionTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid #FFA500" }}
              />
              <Line
                type="monotone"
                dataKey="adoptions"
                stroke="#FFA500"
                strokeWidth={3}
                dot={{ r: 5, fill: "#FFA500" }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 📊 Application Status — Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-1 text-gray-800">Application Status</h2>
          <p className="text-sm text-gray-400 mb-4">Pending, Submitted & Approved</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={applicationStatus} barSize={50}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="status" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid #FFA500" }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {applicationStatus.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Pet Preference — Pie Chart (full width) */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-1 text-gray-800">Pet Preferences</h2>
        <p className="text-sm text-gray-400 mb-4">Based on pets you've liked / bookmarked</p>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={petCategories}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {petCategories.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip
              contentStyle={{ borderRadius: "8px", border: "1px solid #FFA500" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardOverview;
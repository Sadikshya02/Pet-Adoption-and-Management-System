import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StatCard from "./StatCard";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar, CartesianGrid,
} from "recharts";

const COLORS = ["#FFA500", "#FFB347", "#FFCC99", "#FFD699", "#FFAA33", "#FF8C42"];

const DashboardOverview = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    applied: 0, approved: 0, pending: 0, rejected: 0, saved: 0, matches: 0,
  });
  const [applicationStatus, setApplicationStatus] = useState([]);
  const [adoptionTrends, setAdoptionTrends]       = useState([]);
  const [petCategories, setPetCategories]         = useState([]);
  const [recentRequests, setRecentRequests]       = useState([]);
  const [userName, setUserName]                   = useState("");
  const [loading, setLoading]                     = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (!user?._id) return navigate("/login");

        setUserName(user.name || "");

        // Fetch all adoptions and filter by logged-in user's email
        const { data: allAdoptions } = await axios.get(
          "http://localhost:4000/api/adoptions",
          { withCredentials: true }
        );

        const userAdoptions = allAdoptions.filter(
          (a) => a.email === user.email
        );

        const applied  = userAdoptions.length;
        const approved = userAdoptions.filter(a => a.status === "approved").length;
        const pending  = userAdoptions.filter(a => a.status === "pending").length;
        const rejected = userAdoptions.filter(a => a.status === "rejected").length;
        const saved    = user.favorites?.length || 0;

        //  Fetch matches for this user
        const { data: matches } = await axios.get(
          `http://localhost:4000/api/matches/${user._id}`,
          { withCredentials: true }
        );

        setStats({ applied, approved, pending, rejected, saved, matches: matches.length });

        // Application status bar chart
        setApplicationStatus([
          { status: "Pending",  count: pending  },
          { status: "Approved", count: approved },
          { status: "Rejected", count: rejected },
        ]);

        // Adoption trends — group user's adoptions by month
        const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const trendMap = {};
        userAdoptions.forEach((a) => {
          const month = monthNames[new Date(a.createdAt).getMonth()];
          trendMap[month] = (trendMap[month] || 0) + 1;
        });
        const trendData = monthNames
          .filter(m => trendMap[m])
          .map(m => ({ month: m, adoptions: trendMap[m] }));

        setAdoptionTrends(
          trendData.length > 0 ? trendData : [{ month: "No data", adoptions: 0 }]
        );

        //  Pet categories from user's matched pets
        const categoryMap = {};
        matches.forEach((match) => {
          const species = match.pet?.species || "Other";
          categoryMap[species] = (categoryMap[species] || 0) + 1;
        });
        const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
        setPetCategories(
          categoryData.length > 0 ? categoryData : [{ name: "No matches yet", value: 1 }]
        );

        // Recent 3 adoption requests
        setRecentRequests(userAdoptions.slice(0, 3));

      } catch (err) {
        console.error("Dashboard error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const getStatusColor = (status) => {
    if (status === "approved") return "bg-green-100 text-green-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">

      {/*  Header with real username */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-semibold text-gray-800">
          Welcome back, {userName ? userName : ""}  
        </h1>
        <p className="text-gray-500 mt-1">Here's your personal adoption dashboard</p>

        {/*  Stat Cards — all real data */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard title="Applied"      value={loading ? "..." : stats.applied}   />
          <StatCard title="Approved"     value={loading ? "..." : stats.approved} />
          <StatCard title="Pending"      value={loading ? "..." : stats.pending}   />
          <StatCard title="Rejected"     value={loading ? "..." : stats.rejected}  />
          <StatCard title="Saved Pets"   value={loading ? "..." : stats.saved}     />
          <StatCard title="Pet Matches"  value={loading ? "..." : stats.matches}   />
        </div>
      </div>

      {/* Recent Adoption Requests */}
      {recentRequests.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Recent Adoption Requests</h2>
          <div className="space-y-3">
            {recentRequests.map((req) => (
              <div key={req._id} className="flex items-center justify-between border border-gray-100 rounded-lg p-3">
                <div>
                  <p className="font-medium text-gray-800">{req.petName}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(req.createdAt).toLocaleDateString("en-US", {
                      year: "numeric", month: "short", day: "numeric"
                    })}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${getStatusColor(req.status)}`}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/dashboard/requests")}
            className="mt-4 text-sm text-orange-500 hover:underline"
          >
            View all requests →
          </button>
        </div>
      )}

      {/* Row: Adoption Trends + Application Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Adoption Trends — real data grouped by month */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-1 text-gray-800">My Adoption Activity</h2>
          <p className="text-sm text-gray-400 mb-4">Your requests over time</p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={adoptionTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #FFA500" }} />
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

        {/*  Application Status — real data */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-1 text-gray-800">Application Status</h2>
          <p className="text-sm text-gray-400 mb-4">Your adoption request breakdown</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={applicationStatus} barSize={50}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="status" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #FFA500" }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {applicationStatus.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/*  Pet Categories from matched pets */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-1 text-gray-800">Your Matched Pet Types</h2>
        <p className="text-sm text-gray-400 mb-4">Based on your personality match results</p>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={petCategories}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {petCategories.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #FFA500" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default DashboardOverview;
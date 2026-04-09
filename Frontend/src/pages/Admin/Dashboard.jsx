import React, { useEffect, useState } from "react";
import axios from "../../api";
import StatCard from "../../components/StatCard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#FFA500", "#FFB347", "#FFCC99", "#FFD699", "#FFAA33", "#FF8C42"];

export default function Dashboard() {
  const [stats, setStats]                   = useState({ totalRequests: 0, approved: 0, pending: 0, rejected: 0, totalUsers: 0, totalPets: 0 });
  const [adoptionTrends, setAdoptionTrends] = useState([]);
  const [applicationStatus, setApplicationStatus] = useState([]);
  const [petCategories, setPetCategories]   = useState([]);
  const [loading, setLoading]               = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await axios.get("/dashboard");
        const { stats, adoptionTrends, petCategories } = res.data;

        setStats(stats);

        // backend returns adoptionTrends as [{ _id: monthNumber, count }]
        // convert to [{ month: "Jan", count: 3 }] for the chart
        const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const formattedTrends = (adoptionTrends || []).map(t => ({
          month: monthNames[t._id - 1],
          count: t.count,
        }));
        setAdoptionTrends(formattedTrends);

        // build applicationStatus array from stats for the bar chart
        setApplicationStatus([
          { status: "Approved", count: stats.approved },
          { status: "Pending",  count: stats.pending  },
          { status: "Rejected", count: stats.rejected },
        ]);

        //  backend returns petCategories as [{ _id: "Dog", count: 3 }]
        // convert to [{ name: "Dog", value: 3 }] for the pie chart
        const formattedCategories = (petCategories || []).map(c => ({
          name:  c._id,
          value: c.count,
        }));
        setPetCategories(formattedCategories);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading) return <div className="text-center py-10">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Pets"        value={stats.totalPets}      />  
        <StatCard title="Approved Adoptions" value={stats.approved}   />
        <StatCard title="Pending Requests"  value={stats.pending}      />
        <StatCard title="Total Users"       value={stats.totalUsers}   />  
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Adoption Trends</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={adoptionTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#FFA500" strokeWidth={3} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Application Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={applicationStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count">
                {applicationStatus.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="font-semibold mb-2">Pet Preferences</h2>
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
            <Tooltip />
            <Legend verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
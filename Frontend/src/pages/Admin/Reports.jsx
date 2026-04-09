import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import axios from "../../api"; // make sure api.js is in src/api.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function Reports() {
  const [metrics, setMetrics] = useState([]);
  const [barData, setBarData] = useState({ labels: [], datasets: [] });
  const [pieData, setPieData] = useState({ labels: [], datasets: [] });
  const [topBreeds, setTopBreeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await axios.get("/reports"); // GET /api/reports
        const { adoptionTrends, requestStatus, metrics, topBreeds } = res.data;

        // Bar chart
        setBarData({
          labels: adoptionTrends.map(item => item.month),
          datasets: [
            {
              label: "Adoptions",
              data: adoptionTrends.map(item => item.count),
              backgroundColor: "#F97316",
              borderRadius: 6,
              borderSkipped: false,
            },
          ],
        });

        // Pie chart
        setPieData({
          labels: Object.keys(requestStatus),
          datasets: [
            {
              data: Object.values(requestStatus),
              backgroundColor: ["#22C55E", "#F97316", "#EF4444"],
              borderWidth: 0,
            },
          ],
        });

        // Metrics
        setMetrics(metrics);

        // Top Breeds
        setTopBreeds(topBreeds);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, []);

  const barOpts = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11 }, color: "#78716C" } },
      y: { grid: { color: "rgba(0,0,0,0.04)" }, ticks: { font: { size: 11 }, color: "#78716C" }, beginAtZero: true },
    },
  };

  const pieOpts = {
    responsive: true,
    plugins: {
      legend: { position: "bottom", labels: { font: { size: 11 }, boxWidth: 10, padding: 12 } },
    },
  };

  if (loading) return <div className="text-center py-8">Loading reports...</div>;

  return (
    <div className="space-y-6">
      {/* Mini metrics */}
      <div className="flex flex-col sm:flex-row gap-4">
        {metrics.map(({ value, label }) => (
          <div key={label} className="bg-white rounded-lg shadow p-4 flex-1 text-center">
            <div className="text-xl font-bold">{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between mb-2">
            <div>
              <div className="text-lg font-semibold">Monthly Adoptions</div>
              <div className="text-sm text-gray-400">2026</div>
            </div>
          </div>
          <Bar data={barData} options={barOpts} height={200} />
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between mb-2">
            <div>
              <div className="text-lg font-semibold">Request Status</div>
              <div className="text-sm text-gray-400">All time</div>
            </div>
          </div>
          <Pie data={pieData} options={pieOpts} />
        </div>
      </div>

      {/* Top Adopted Breeds */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between mb-4">
          <div>
            <div className="text-lg font-semibold">Top Adopted Breeds</div>
            <div className="text-sm text-gray-400">All time leaderboard</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm uppercase">
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">Breed</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Adopted</th>
                <th className="px-3 py-2">Rate</th>
              </tr>
            </thead>
            <tbody>
              {topBreeds.map(({ rank, breed, type, count, cls, rate }) => (
                <tr key={rank} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-3 py-2 font-semibold">{rank}</td>
                  <td className="px-3 py-2">{breed}</td>
                  <td className="px-3 py-2">{type}</td>
                  <td className="px-3 py-2">{count}</td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>{rate}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
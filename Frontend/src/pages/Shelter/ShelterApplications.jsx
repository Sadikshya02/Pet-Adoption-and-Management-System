import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ShelterApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const shelter = JSON.parse(localStorage.getItem("shelter") || "{}");

  useEffect(() => {
    // Fetch all adoptions and filter by shelter's pets
    axios.get("http://localhost:4000/api/adoptions", { withCredentials: true })
      .then(r => {
        setApplications(r.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:4000/api/adoptions/${id}`, { status }, { withCredentials: true });
      setApplications(prev => prev.map(a => a._id === id ? { ...a, status } : a));
    } catch { alert("Failed to update"); }
  };

  const statusColor = {
    pending:  "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Adoption Applications</h1>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="animate-pulse bg-gray-200 rounded-2xl h-20" />)}
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="text-5xl mb-3">📋</div>
          <p className="text-gray-500 font-medium">No applications yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map(app => (
            <div key={app._id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="font-bold text-gray-900">{app.name}</div>
                <div className="text-sm text-gray-500">{app.email} · {app.phone}</div>
                <div className="text-sm text-gray-500 mt-1">Pet: <span className="font-semibold text-orange-600">{app.petName}</span></div>
                {app.note && <div className="text-sm text-gray-400 italic mt-1">"{app.note}"</div>}
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${statusColor[app.status] || "bg-gray-100 text-gray-600"}`}>
                  {app.status}
                </span>
                {app.status === "pending" && (
                  <div className="flex gap-2">
                    <button onClick={() => updateStatus(app._id, "approved")}
                      className="bg-green-500 text-white text-xs font-bold px-4 py-1.5 rounded-lg hover:bg-green-600 transition">
                      Approve
                    </button>
                    <button onClick={() => updateStatus(app._id, "rejected")}
                      className="bg-red-500 text-white text-xs font-bold px-4 py-1.5 rounded-lg hover:bg-red-600 transition">
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ShelterOverview() {
  const shelter = JSON.parse(localStorage.getItem("shelter") || "{}");
  const [stats, setStats] = useState({ total: 0, available: 0, adopted: 0, medicalHold: 0 });

  useEffect(() => {
    axios.get("http://localhost:4000/api/shelters/stats", { withCredentials: true })
      .then(r => setStats(r.data.data))
      .catch(() => {});
  }, []);

  const cards = [
    { label: "Total Pets",    value: stats.total,       color: "bg-blue-50 text-blue-700",   },
    { label: "Available",     value: stats.available,   color: "bg-green-50 text-green-700",  },
    { label: "Adopted",       value: stats.adopted,     color: "bg-purple-50 text-purple-700", },
    { label: "Medical Hold",  value: stats.medicalHold, color: "bg-red-50 text-red-700",  },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
        Welcome back, {shelter.organizationName} 
      </h1>
      <p className="text-gray-500 mb-8">Here's an overview of your shelter activity.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map(c => (
          <div key={c.label} className={`${c.color} rounded-2xl p-6`}>
            <div className="text-3xl mb-2">{c.emoji}</div>
            <div className="text-3xl font-extrabold">{c.value}</div>
            <div className="text-sm font-semibold mt-1 opacity-80">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "Add New Pet",        href: "/shelter/dashboard/pets",         emoji: "➕" },
            { label: "View Applications",  href: "/shelter/dashboard/applications", emoji: "📋" },
            { label: "Publish a Tip",      href: "/shelter/dashboard/tips",         emoji: "📝" },
            { label: "Update Profile",     href: "/shelter/dashboard/profile",      emoji: "✏️" },
          ].map(a => (
            <a key={a.label} href={a.href}
              className="flex items-center gap-3 bg-gray-50 hover:bg-orange-50 hover:text-orange-600 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 transition">
              <span>{a.emoji}</span> {a.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
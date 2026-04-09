import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function AdminLayout() {
  const location = useLocation();  // Get current URL path

  // Menu items
  const menu = [
    { name: "Dashboard", path: "/admin" },
    { name: "Adoptions", path: "/admin/adoptions" },
    { name: "Users", path: "/admin/users" },
    { name: "Pets", path: "/admin/pets" },
    { name: "Reports", path: "/admin/reports" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-8"> Admin Panel</h2>
        <nav className="flex flex-col gap-3">
          {menu.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`px-3 py-2 rounded hover:bg-gray-200 transition ${
                location.pathname === item.path ? "bg-gray-300 font-semibold" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-6">
        <Outlet />
      </main>
    </div>
  );
}
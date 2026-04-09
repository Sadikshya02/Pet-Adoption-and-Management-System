import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, PawPrint, Heart, ClipboardList,
  Bell, User, HelpCircle, LogOut, Sparkles, //Sparkles for Pet Matches
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();

  const menu = [
    { name: "Dashboard",    icon: LayoutDashboard, path: "/dashboard" },
    { name: "Explore Pets", icon: PawPrint,         path: "/dashboard/explore" },
    { name: "My Requests",  icon: ClipboardList,    path: "/dashboard/requests" },
    { name: "Saved Pets",   icon: Heart,            path: "/dashboard/saved-pets" },
    { name: "Pet Matches",  icon: Sparkles,         path: "/dashboard/pet-matches" }, 
    { name: "Notifications",icon: Bell,             path: "/dashboard/notifications" },
    { name: "Profile",      icon: User,             path: "/dashboard/profile" },
    { name: "Help",         icon: HelpCircle,       path: "/dashboard/help" },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white border-r relative">
      {/* Logo */}
      <div className="p-6 text-2xl font-bold text-orange-600">FureverHome</div>

      {/* Menu */}
      <nav className="px-4 space-y-1">
        {menu.map((item, index) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition
                ${isActive ? "bg-orange-100 text-orange-600" : "text-gray-600 hover:bg-orange-50"}`
              }
            >
              <Icon size={18} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-6 left-4 right-4">
        <button
          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
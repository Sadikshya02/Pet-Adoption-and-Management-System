import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Bell } from "lucide-react";

export default function ShelterNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [open, setOpen]                   = useState(false);
  const ref = useRef(null);

  const fetchNotifications = async () => {
    try {
      const r = await axios.get("http://localhost:4000/api/shelter-notifications", {
        withCredentials: true,
      });
      setNotifications(r.data.data);
      setUnreadCount(r.data.unreadCount);
    } catch {}
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = async () => {
    try {
      await axios.patch(
        "http://localhost:4000/api/shelter-notifications/read-all",
        {},
        { withCredentials: true }
      );
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch {}
  };

  const markOneRead = async (id) => {
    try {
      await axios.patch(
        `http://localhost:4000/api/shelter-notifications/${id}/read`,
        {},
        { withCredentials: true }
      );
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {}
  };

  const typeIcon = {
    approval:    "✅",
    rejection:   "❌",
    application: "📋",
    general:     "📢",
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl hover:bg-orange-50 transition"
      >
        <Bell size={22} className="text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-orange-500 font-semibold hover:text-orange-700 transition"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {notifications.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-3xl mb-2">🔔</div>
                <p className="text-sm text-gray-400">No notifications yet</p>
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n._id}
                  onClick={() => !n.isRead && markOneRead(n._id)}
                  className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition ${
                    !n.isRead ? "bg-orange-50" : ""
                  }`}
                >
                  <span className="text-xl flex-shrink-0">{typeIcon[n.type] || "📢"}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold text-gray-900 ${!n.isRead ? "text-orange-700" : ""}`}>
                      {n.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(n.createdAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {!n.isRead && (
                    <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
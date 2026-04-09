import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, PawPrint, MessageCircle, CheckCheck, Trash2 } from "lucide-react";
import axios from "axios";

const API = "http://localhost:4000/api";

const TYPE_STYLES = {
  status:  { icon: PawPrint,       bg: "#FFF0E6", color: "#E07B39", label: "Status Update" },
  match:   { icon: PawPrint,       bg: "#EAF3DE", color: "#3B6D11", label: "Pet Match"     },
  message: { icon: MessageCircle,  bg: "#E6F1FB", color: "#185FA5", label: "Message"       },
};

const EMOJI_MAP = { status: "🐾", match: "🐶", message: "💬" };

const FILTERS    = ["All", "Status Updates", "Pet Matches", "Messages"];
const FILTER_MAP = { "All": null, "Status Updates": "status", "Pet Matches": "match", "Messages": "message" };

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 60)  return `${mins} minute${mins !== 1 ? "s" : ""} ago`;
  if (hours < 24)  return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  if (days  < 7)   return `${days} day${days !== 1 ? "s" : ""} ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function NotificationCard({ notif, onRead, onDelete }) {
  const t    = TYPE_STYLES[notif.type] || TYPE_STYLES.status;
  const Icon = t.icon;

  return (
    <div style={{
      display: "flex", gap: 16, alignItems: "flex-start",
      background: notif.read ? "#fff" : "#FFFBF7",
      borderRadius: 16,
      border: notif.read ? "1px solid #F0EDE8" : "1px solid #FFD9BB",
      padding: "18px 20px", position: "relative",
      transition: "box-shadow 0.2s",
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.06)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
    >
      {!notif.read && (
        <div style={{ position: "absolute", top: 18, right: 18, width: 8, height: 8, borderRadius: "50%", background: "#E07B39" }} />
      )}

      <div style={{
        width: 52, height: 52, borderRadius: 14,
        background: t.bg, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
      }}>
        {EMOJI_MAP[notif.type] || ""}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 10,
            background: t.bg, color: t.color, display: "flex", alignItems: "center", gap: 4,
          }}>
            <Icon size={10} /> {t.label}
          </span>
          <span style={{ fontSize: 11, color: "#BBB" }}>{timeAgo(notif.createdAt)}</span>
        </div>
        <div style={{ fontWeight: notif.read ? 500 : 700, fontSize: 14, color: "#1E1E1C", marginBottom: 4 }}>{notif.title}</div>
        <div style={{ fontSize: 13, color: "#888", lineHeight: 1.6 }}>{notif.message}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0, marginLeft: 8 }}>
        {!notif.read && (
          <button onClick={() => onRead(notif._id)} title="Mark as read" style={{
            background: "#F0F9F4", border: "1px solid #C8EDD8", borderRadius: 8,
            padding: "5px 8px", cursor: "pointer", color: "#3B6D11",
            display: "flex", alignItems: "center", transition: "background 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "#D8F0E4"}
            onMouseLeave={e => e.currentTarget.style.background = "#F0F9F4"}
          >
            <CheckCheck size={14} />
          </button>
        )}
        <button onClick={() => onDelete(notif._id)} title="Delete" style={{
          background: "#FFF5F5", border: "1px solid #FFCDD2", borderRadius: 8,
          padding: "5px 8px", cursor: "pointer", color: "#E53935",
          display: "flex", alignItems: "center", transition: "background 0.2s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "#FFEBEE"}
          onMouseLeave={e => e.currentTarget.style.background = "#FFF5F5"}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [filter, setFilter]               = useState("All");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (!user?._id) return navigate("/login");

        const { data } = await axios.get(`${API}/notifications`, {
          params: { userId: user._id },
          withCredentials: true,
        });
        setNotifications(data);
      } catch (err) {
        console.error("Notifications error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleRead = async (id) => {
    try {
      await axios.patch(`${API}/notifications/${id}/read`, {}, { withCredentials: true });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) { console.error(err.message); }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/notifications/${id}`, { withCredentials: true });
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) { console.error(err.message); }
  };

  const handleMarkAllRead = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      await axios.patch(`${API}/notifications/mark-all-read`, {}, {
        params: { userId: user._id }, withCredentials: true,
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) { console.error(err.message); }
  };

  const handleClearRead = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      await axios.delete(`${API}/notifications/clear-read`, {
        params: { userId: user._id }, withCredentials: true,
      });
      setNotifications(prev => prev.filter(n => !n.read));
    } catch (err) { console.error(err.message); }
  };

  const filterType = FILTER_MAP[filter];
  const filtered   = filterType ? notifications.filter(n => n.type === filterType) : notifications;
  const unread     = filtered.filter(n => !n.read);
  const read       = filtered.filter(n => n.read);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: "#FAF8F5", minHeight: "100vh", padding: "2.5rem 2rem" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap'); * { box-sizing: border-box; }`}</style>

      <div style={{ maxWidth: 820, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: "'Lora', serif", fontSize: 26, fontWeight: 700, color: "#1E1E1C", margin: "0 0 6px", display: "flex", alignItems: "center", gap: 10 }}>
              <Bell size={24} color="#E07B39" />
              Notifications
              {unreadCount > 0 && (
                <span style={{ background: "#E07B39", color: "#fff", fontSize: 12, fontWeight: 700, padding: "2px 9px", borderRadius: 20 }}>{unreadCount}</span>
              )}
            </h1>
            <p style={{ fontSize: 14, color: "#999", margin: 0 }}>Stay up to date with your adoption journey.</p>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} style={{ display: "flex", alignItems: "center", gap: 6, background: "#F0F9F4", border: "1px solid #C8EDD8", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 600, color: "#3B6D11", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.background = "#D8F0E4"}
                onMouseLeave={e => e.currentTarget.style.background = "#F0F9F4"}
              >
                <CheckCheck size={15} /> Mark all read
              </button>
            )}
            <button onClick={handleClearRead} style={{ display: "flex", alignItems: "center", gap: 6, background: "#FFF5F5", border: "1px solid #FFCDD2", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 600, color: "#E53935", cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.background = "#FFEBEE"}
              onMouseLeave={e => e.currentTarget.style.background = "#FFF5F5"}
            >
              <Trash2 size={15} /> Clear read
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "7px 16px", borderRadius: 20, fontSize: 13, fontWeight: 500,
              fontFamily: "inherit", cursor: "pointer",
              border: filter === f ? "1.5px solid #E07B39" : "1.5px solid #F0EDE8",
              background: filter === f ? "#FFF0E6" : "#fff",
              color: filter === f ? "#E07B39" : "#888", transition: "all 0.2s",
            }}>{f}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#AAA", fontSize: 15 }}>Loading notifications... 🔔</div>
        ) : (
          <>
            {unread.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#AAA", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>New · {unread.length}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {unread.map(n => <NotificationCard key={n._id} notif={n} onRead={handleRead} onDelete={handleDelete} />)}
                </div>
              </div>
            )}

            {read.length > 0 && (
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#AAA", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Earlier · {read.length}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {read.map(n => <NotificationCard key={n._id} notif={n} onRead={handleRead} onDelete={handleDelete} />)}
                </div>
              </div>
            )}

            {filtered.length === 0 && (
              <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #F0EDE8", padding: "56px 24px", textAlign: "center" }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}></div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#2C2C2A", marginBottom: 6 }}>All caught up!</div>
                <div style={{ fontSize: 13, color: "#AAA" }}>No {filter !== "All" ? filter.toLowerCase() : ""} notifications right now.</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
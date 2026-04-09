import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PawPrint } from "lucide-react";
import axios from "axios";

const API = "http://localhost:4000/api";

const COLOR_PAIRS = [
  { color: "#E1F5EE", textColor: "#0F6E56" },
  { color: "#FAEEDA", textColor: "#854F0B" },
  { color: "#E6F1FB", textColor: "#185FA5" },
  { color: "#FBEAF0", textColor: "#993556" },
  { color: "#FFF0E6", textColor: "#E07B39" },
  { color: "#F0EEFF", textColor: "#5B4DB8" },
];

const STATUS_STYLES = {
  pending:      { bg: "#FAEEDA", color: "#854F0B", dot: "#EF9F27", label: "Pending"      },
  approved:     { bg: "#EAF3DE", color: "#3B6D11", dot: "#639922", label: "Approved"     },
  rejected:     { bg: "#FCEBEB", color: "#A32D2D", dot: "#E24B4A", label: "Rejected"     },
  "under review":{ bg: "#E6F1FB", color: "#185FA5", dot: "#378ADD", label: "Under Review" },
};

function getEmoji(species = "") {
  const s = species.toLowerCase();
  if (s.includes("cat"))    return "🐱";
  if (s.includes("rabbit")) return "🐰";
  return "🐶";
}

function getInitials(name = "") {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

function Stars({ count, total = 5 }) {
  return (
    <span style={{ color: "#EF9F27", fontSize: 15, letterSpacing: 2 }}>
      {"★".repeat(count)}
      <span style={{ color: "#E0DED6" }}>{"★".repeat(total - count)}</span>
    </span>
  );
}

function Tab({ label, active, onClick, count }) {
  return (
    <button onClick={onClick} style={{
      background: "none", border: "none", cursor: "pointer",
      padding: "14px 6px", fontSize: 14, fontFamily: "inherit",
      fontWeight: active ? 600 : 400,
      color: active ? "#E07B39" : "#999",
      borderBottom: active ? "2px solid #E07B39" : "2px solid transparent",
      transition: "all 0.2s", display: "flex", alignItems: "center", gap: 7, whiteSpace: "nowrap",
    }}>
      {label}
      <span style={{ background: active ? "#FFF0E6" : "#F5F4F0", color: active ? "#E07B39" : "#999", fontSize: 11, fontWeight: 600, padding: "2px 7px", borderRadius: 10 }}>{count}</span>
    </button>
  );
}

// Adopted Pets Tab 
function AdoptedSection({ adoptions }) {
  const approved = adoptions.filter(a => a.status === "approved");
  if (approved.length === 0) return <EmptyTab  label="No adopted pets yet" />;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
      {approved.map((a, i) => {
        const pair = COLOR_PAIRS[i % COLOR_PAIRS.length];
        return (
          <div key={a._id} style={{ background: "#fff", borderRadius: 16, border: "1px solid #F0EDE8", overflow: "hidden", transition: "transform 0.2s, box-shadow 0.2s", cursor: "pointer" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ background: pair.color, height: 100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, overflow: "hidden" }}>
              {a.petImage ? <img src={a.petImage} alt={a.petName} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : getEmoji(a.petSpecies)}
            </div>
            <div style={{ padding: "14px 16px 16px" }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#2C2C2A", marginBottom: 3 }}>{a.petName}</div>
              <div style={{ fontSize: 13, color: "#999", marginBottom: 10 }}>{a.petBreed || "—"}</div>
              <span style={{ fontSize: 12, fontWeight: 500, background: pair.color, color: pair.textColor, padding: "4px 10px", borderRadius: 20 }}>
                Adopted {new Date(a.updatedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Saved Pets Tab 
function FavoritesSection({ savedPets, onUnsave }) {
  if (savedPets.length === 0) return <EmptyTab  label="No saved pets yet" />;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
      {savedPets.map((pet, i) => {
        const pair = COLOR_PAIRS[i % COLOR_PAIRS.length];
        return (
          <div key={pet._id} style={{ background: "#fff", borderRadius: 16, border: "1px solid #F0EDE8", overflow: "hidden", position: "relative", transition: "transform 0.2s, box-shadow 0.2s", cursor: "pointer" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <button onClick={() => onUnsave(pet.savedId)} style={{ position: "absolute", top: 10, right: 10, background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>❤️</button>
            <div style={{ background: pair.color, height: 100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, overflow: "hidden" }}>
              {pet.imageUrl ? <img src={pet.imageUrl} alt={pet.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : getEmoji(pet.species)}
            </div>
            <div style={{ padding: "14px 16px 16px" }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#2C2C2A", marginBottom: 3 }}>{pet.name}</div>
              <div style={{ fontSize: 13, color: "#999", marginBottom: 6 }}>{pet.breed}</div>
              <div style={{ fontSize: 12, color: "#BBB" }}>{pet.shelter || pet.location || ""}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Applications Tab 
function ApplicationsSection({ adoptions }) {
  if (adoptions.length === 0) return <EmptyTab  label="No applications yet" />;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {adoptions.map((app) => {
        const s = STATUS_STYLES[app.status?.toLowerCase()] || STATUS_STYLES.pending;
        return (
          <div key={app._id} style={{ display: "flex", alignItems: "center", gap: 16, background: "#fff", border: "1px solid #F0EDE8", borderRadius: 14, padding: "16px 20px", transition: "box-shadow 0.2s", cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.06)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
          >
            <div style={{ width: 50, height: 50, borderRadius: "50%", background: "#FAF8F5", fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
              {app.petImage ? <img src={app.petImage} alt={app.petName} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} /> : getEmoji(app.petSpecies)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 15, color: "#2C2C2A", marginBottom: 3 }}>{app.petName}{app.petBreed ? ` — ${app.petBreed}` : ""}</div>
              <div style={{ fontSize: 13, color: "#999" }}>{app.shelter || "Shelter"} · {new Date(app.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, padding: "5px 14px", borderRadius: 20, background: s.bg, color: s.color, display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

//  Reviews Tab 
function ReviewsSection({ reviews }) {
  if (reviews.length === 0) return <EmptyTab  label="No reviews yet" />;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {reviews.map(r => (
        <div key={r._id} style={{ background: "#fff", border: "1px solid #F0EDE8", borderRadius: 16, padding: "20px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#2C2C2A", marginBottom: 2 }}>{r.shelter}</div>
              <div style={{ fontSize: 13, color: "#999" }}>Review for {r.petId?.name || "pet"}</div>
            </div>
            <Stars count={r.rating} />
          </div>
          <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, margin: "0 0 12px" }}>{r.text}</p>
          <div style={{ fontSize: 12, color: "#BBB" }}>{new Date(r.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</div>
        </div>
      ))}
    </div>
  );
}

function EmptyTab({ emoji, label }) {
  return (
    <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #F0EDE8", padding: "48px 24px", textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{emoji}</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: "#2C2C2A" }}>{label}</div>
    </div>
  );
}

//  Main Profile 
export default function UserProfile() {
  const navigate    = useNavigate();
  const [activeTab, setActiveTab]   = useState("adopted");
  const [user, setUser]             = useState(null);
  const [adoptions, setAdoptions]   = useState([]);
  const [savedPets, setSavedPets]   = useState([]);
  const [reviews, setReviews]       = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = JSON.parse(localStorage.getItem("user") || "{}");
        if (!stored?._id) return navigate("/login");
        setUser(stored);

        // Fetch all data in parallel
        const [adoptRes, savedRes, reviewRes] = await Promise.allSettled([
          axios.get(`${API}/adoptions`, { withCredentials: true }),
          axios.get(`${API}/saved-pets`, { params: { userId: stored._id }, withCredentials: true }),
          axios.get(`${API}/reviews`,    { params: { userId: stored._id }, withCredentials: true }),
        ]);

        // Adoptions — filter by user email, enrich with pet image
        if (adoptRes.status === "fulfilled") {
          const userAdoptions = adoptRes.value.data.filter(a => a.email === stored.email);
          const enriched = await Promise.all(
            userAdoptions.map(async (a) => {
              try {
                const { data: pet } = await axios.get(`${API}/pets/${a.petId}`, { withCredentials: true });
                return { ...a, petImage: pet.imageUrl || "", petSpecies: pet.species || "", petBreed: pet.breed || "" };
              } catch {
                return { ...a, petImage: "", petSpecies: "", petBreed: "" };
              }
            })
          );
          setAdoptions(enriched);
        }

        if (savedRes.status   === "fulfilled") setSavedPets(savedRes.value.data);
        if (reviewRes.status  === "fulfilled") setReviews(reviewRes.value.data);

      } catch (err) {
        console.error("Profile load error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleUnsave = async (savedId) => {
    try {
      await axios.delete(`${API}/saved-pets/${savedId}`, { withCredentials: true });
      setSavedPets(prev => prev.filter(p => p.savedId !== savedId));
    } catch (err) { console.error(err.message); }
  };

  if (loading) return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#FAF8F5", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#AAA", fontSize: 15 }}>
      Loading profile... 🐾
    </div>
  );

  if (!user) return null;

  const approvedCount = adoptions.filter(a => a.status === "approved").length;
  const avgRating     = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  const tabs = [
    { key: "adopted",      label: "Adopted pets",      count: approvedCount   },
    { key: "favorites",    label: "Favorites",          count: savedPets.length },
    { key: "applications", label: "Applications",       count: adoptions.length },
    { key: "reviews",      label: "Reviews & ratings",  count: reviews.length  },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: "#FAF8F5", minHeight: "100vh", padding: "3rem 2rem" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Lora:wght@500;600;700&family=DM+Sans:wght@400;500;600&display=swap'); * { box-sizing: border-box; } ::-webkit-scrollbar { height: 4px; } ::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }`}</style>

      <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Profile Hero */}
        <div style={{ background: "#fff", borderRadius: 24, border: "1px solid #F0EDE8", padding: "36px 40px" }}>
          <div style={{ display: "flex", gap: 28, alignItems: "flex-start", marginBottom: 24 }}>

            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{
                width: 90, height: 90, borderRadius: "50%",
                background: "linear-gradient(145deg, #FFBE8A, #E07B39)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Lora', serif", fontSize: 30, fontWeight: 700, color: "#fff", letterSpacing: 1,
              }}>
                {user.profileImage
                  ? <img src={user.profileImage} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                  : getInitials(user.name)
                }
              </div>
              <div style={{ position: "absolute", bottom: 2, right: 2, width: 26, height: 26, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
                <PawPrint size={14} color="#E07B39" />
              </div>
            </div>

            {/* Name + meta */}
            <div style={{ flex: 1 }}>
              <h1 style={{ fontFamily: "'Lora', serif", fontSize: 26, fontWeight: 700, color: "#1E1E1C", margin: "0 0 6px" }}>{user.name}</h1>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
                {user.location && <span style={{ fontSize: 14, color: "#999" }}> {user.location}</span>}
                {user.createdAt && (
                  <span style={{ fontSize: 14, color: "#999" }}>
                    🗓️ Member since {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </span>
                )}
              </div>
              {user.tags?.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {user.tags.map(t => (
                    <span key={t} style={{ fontSize: 12, fontWeight: 500, background: "#FFF0E6", color: "#E07B39", padding: "4px 12px", borderRadius: 20, border: "1px solid #FFD9BB" }}>{t}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Edit button */}
            <button onClick={() => navigate("/dashboard/edit-profile")} style={{ background: "#FFF0E6", border: "1px solid #FFD9BB", borderRadius: 22, padding: "9px 22px", fontSize: 13, fontWeight: 600, fontFamily: "inherit", color: "#E07B39", cursor: "pointer", whiteSpace: "nowrap", transition: "background 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#FFE4CC"}
              onMouseLeave={e => e.currentTarget.style.background = "#FFF0E6"}
            >
              ✏️ Edit Profile
            </button>
          </div>

          {/* Bio */}
          {user.bio && (
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.8, background: "#FAF8F5", borderRadius: 12, padding: "16px 20px", margin: "0 0 24px", borderLeft: "3px solid #E07B39" }}>
              {user.bio}
            </p>
          )}

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {[
              { label: "Pets Adopted",   val: approvedCount,    },
              { label: "Saved Pets",     val: savedPets.length,  },
              { label: "Avg Rating",     val: avgRating,        },
              { label: "Reviews Left",   val: reviews.length,    },
            ].map(s => (
              <div key={s.label} style={{ background: "#FAF8F5", borderRadius: 14, padding: "18px 14px", textAlign: "center", border: "1px solid #F0EDE8" }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{s.emoji}</div>
                <div style={{ fontFamily: "'Lora', serif", fontSize: 26, fontWeight: 700, color: "#E07B39", lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: 12, color: "#AAA", marginTop: 5 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs Card */}
        <div style={{ background: "#fff", borderRadius: 24, border: "1px solid #F0EDE8", overflow: "hidden" }}>
          <div style={{ display: "flex", gap: 24, padding: "0 32px", borderBottom: "1px solid #F0EDE8", overflowX: "auto" }}>
            {tabs.map(t => <Tab key={t.key} label={t.label} count={t.count} active={activeTab === t.key} onClick={() => setActiveTab(t.key)} />)}
          </div>
          <div style={{ padding: "28px 32px 32px" }}>
            {activeTab === "adopted"      && <AdoptedSection      adoptions={adoptions} />}
            {activeTab === "favorites"    && <FavoritesSection     savedPets={savedPets} onUnsave={handleUnsave} />}
            {activeTab === "applications" && <ApplicationsSection  adoptions={adoptions} />}
            {activeTab === "reviews"      && <ReviewsSection       reviews={reviews} />}
          </div>
        </div>

      </div>
    </div>
  );
}
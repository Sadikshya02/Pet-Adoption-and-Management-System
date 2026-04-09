import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function PetMatches() {
  const navigate                  = useNavigate();
  const [matches, setMatches]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [error, setError]         = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?._id)                    return navigate("/login");
    if (!user?.questionnaireCompleted) return navigate("/questionnaire");
    fetchMatches(user._id);
    setFavorites(user.favorites || []);
  }, []);

  const fetchMatches = async (userId) => {
    try {
      const { data } = await axios.get(
        `http://localhost:4000/api/matches/${userId}`,
        { withCredentials: true }
      );
      setMatches(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load matches");
    } finally {
      setLoading(false);
    }
  };

  const rematch = async () => {
    setLoading(true);
    setError("");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    try {
      const { data } = await axios.post(
        `http://localhost:4000/api/matches/run/${user._id}`,
        {},
        { withCredentials: true }
      );
      setMatches(data);
    } catch (err) {
      setError("Re-match failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (petId) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    try {
      const { data } = await axios.post(
        `http://localhost:4000/api/users/${user._id}/favorites/${petId}`,
        {},
        { withCredentials: true }
      );
      const updatedFavIds = data.favorites.map((f) => f._id || f);
      setFavorites(updatedFavIds);
      localStorage.setItem("user", JSON.stringify({ ...user, favorites: updatedFavIds }));
    } catch (err) {
      console.error(err);
    }
  };

  const getColor = (pct) => {
    if (pct >= 80) return "#22c55e";
    if (pct >= 60) return "#f59e0b";
    return "#ef4444";
  };

  const speciesEmoji = (species) => {
    if (species === "Dog")    return "🐶";
    if (species === "Cat")    return "🐱";
    if (species === "Rabbit") return "🐰";
    return "🐾";
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>🐾 Your Pet Matches</h1>
        <div style={s.headerBtns}>
          <button style={s.rematchBtn} onClick={rematch}> Re-match</button>
          <Link to="/questionnaire" style={s.retakeBtn}> Retake Quiz</Link>
        </div>
      </div>

      {error && <p style={{ textAlign: "center", color: "red", marginTop: "20px" }}>{error}</p>}

      {loading ? (
        <p style={s.center}>Finding your perfect matches... 🐾</p>
      ) : matches.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "80px" }}>
          <p style={{ fontSize: "18px", color: "#666", marginBottom: "16px" }}>No matches found.</p>
          <button style={s.rematchBtn} onClick={rematch}>▶ Run Matching</button>
        </div>
      ) : (
        <div style={s.grid}>
          {matches.map((match, i) => (
            <div key={match._id} style={s.card}>

              {i < 3 && (
                <div style={{ ...s.badge, background: ["#f59e0b", "#94a3b8", "#cd7c3f"][i] }}>
                  {["🥇", "🥈", "🥉"][i]}
                </div>
              )}

              {match.pet?.imageUrl ? (
                <img
                  src={match.pet.imageUrl}
                  alt={match.pet.name}
                  style={s.petImg}
                />
              ) : (
                <div style={s.emojiBox}>
                  {speciesEmoji(match.pet?.species)}
                </div>
              )}

              <div style={s.body}>
                <div style={s.row}>
                  <div>
                    <h3 style={s.petName}>{match.pet?.name}</h3>
                    <p style={s.species}>
                      {match.pet?.species}
                      {match.pet?.breed ? ` · ${match.pet.breed}` : ""}
                    </p>
                  </div>
                  <button style={s.favBtn} onClick={() => toggleFavorite(match.pet._id)}>
                    {favorites.includes(match.pet._id) ? "❤️" : "🤍"}
                  </button>
                </div>

                <div style={s.compatRow}>
                  <span style={{ ...s.compatPct, color: getColor(match.compatibilityPct) }}>
                    {match.compatibilityPct}%
                  </span>
                  <span style={s.compatLabel}>compatibility</span>
                </div>

                <div style={s.bars}>
                  {[
                    { label: "Energy",      diff: match.breakdown?.energyDiff },
                    { label: "Social",      diff: match.breakdown?.socialDiff },
                    { label: "Maintenance", diff: match.breakdown?.maintenanceDiff },
                  ].map(({ label, diff }) => (
                    <div key={label} style={s.barRow}>
                      <span style={s.barLabel}>{label}</span>
                      <div style={s.barTrack}>
                        <div style={{
                          ...s.barFill,
                          width:      `${Math.max(5, 100 - (diff || 0) * 10)}%`,
                          background: diff <= 2 ? "#22c55e" : diff <= 4 ? "#f59e0b" : "#ef4444",
                        }} />
                      </div>
                    </div>
                  ))}
                </div>

                {match.pet?.tags?.length > 0 && (
                  <div style={s.tags}>
                    {match.pet.tags.map((tag) => (
                      <span key={tag} style={s.tag}>{tag}</span>
                    ))}
                  </div>
                )}

                <p style={s.desc}>{match.pet?.description}</p>

                <Link to={`/pets/${match.pet?._id}`} style={s.detailLink}>
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  page:        { minHeight: "100vh", background: "#f0f4f8", padding: "24px" },
  header:      { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "12px" },
  title:       { fontSize: "26px", margin: 0 },
  headerBtns:  { display: "flex", gap: "10px" },
  rematchBtn:  { padding: "8px 16px", background: "#fff", border: "1px solid #ddd", borderRadius: "8px", cursor: "pointer" },
  retakeBtn:   { padding: "8px 16px", background: "#f97316", color: "#fff", borderRadius: "8px", textDecoration: "none", fontSize: "14px" },
  center:      { textAlign: "center", marginTop: "80px", fontSize: "18px", color: "#666" },
  grid:        { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" },
  card:        { background: "#fff", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.08)", position: "relative" },
  badge:       { position: "absolute", top: "10px", left: "10px", padding: "4px 10px", borderRadius: "99px", fontSize: "18px", zIndex: 1 },
  petImg:      { width: "100%", height: "200px", objectFit: "cover", display: "block" },
  emojiBox:    { fontSize: "64px", height: "200px", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9fafb" },
  body:        { padding: "16px" },
  row:         { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  petName:     { margin: 0, fontSize: "18px", fontWeight: "600" },
  species:     { color: "#888", fontSize: "13px", marginTop: "2px" },
  favBtn:      { background: "none", border: "none", fontSize: "22px", cursor: "pointer" },
  compatRow:   { display: "flex", alignItems: "baseline", gap: "6px", margin: "12px 0 8px" },
  compatPct:   { fontSize: "32px", fontWeight: "bold" },
  compatLabel: { color: "#888", fontSize: "13px" },
  bars:        { display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" },
  barRow:      { display: "flex", alignItems: "center", gap: "8px" },
  barLabel:    { width: "80px", fontSize: "12px", color: "#666" },
  barTrack:    { flex: 1, height: "6px", background: "#e5e7eb", borderRadius: "99px" },
  barFill:     { height: "6px", borderRadius: "99px", transition: "width 0.5s" },
  tags:        { display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" },
  tag:         { padding: "3px 10px", background: "#eef2ff", color: "#4f46e5", borderRadius: "99px", fontSize: "12px" },
  desc:        { color: "#666", fontSize: "13px", lineHeight: 1.5, margin: "0 0 12px" },
  detailLink:  { color: "#f97316", fontSize: "14px", fontWeight: "500", textDecoration: "none" },
};
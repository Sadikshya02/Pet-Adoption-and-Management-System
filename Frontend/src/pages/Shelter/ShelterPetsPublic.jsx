import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const STATUS_MAP = {
  Available:      { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  Reserved:       { color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  Adopted:        { color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  "Medical Hold": { color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
};

const SPECIES_EMOJI = { Dog: "🐕", Cat: "🐱", Rabbit: "🐰", Bird: "🐦", Other: "🐾" };

const tagStyle = {
  fontSize: 11, fontWeight: 600, padding: "3px 10px",
  borderRadius: 20, background: "#f3f4f6", color: "#374151",
  border: "1px solid #e5e7eb",
};

export default function ShelterPetsPublic() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [shelter, setShelter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/shelters/${id}/pets`)
      .then((r) => { setPets(r.data.pets); setShelter(r.data.shelter); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const speciesOptions = ["All", ...new Set(pets.map((p) => p.species))];

  const filtered = pets.filter((p) => {
    const matchSpecies = filter === "All" || p.species === filter;
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.breed?.toLowerCase().includes(search.toLowerCase());
    return matchSpecies && matchSearch;
  });

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#fefce8", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🐾</div>
        <p style={{ color: "#92400e", fontSize: 15, fontWeight: 600 }}>Finding furry friends…</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#fefce8", fontFamily: "system-ui, sans-serif" }}>

      {/* ── Compact Shelter Header ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "20px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "transparent", border: "none",
              color: "#ea580c", fontSize: 13, fontWeight: 600,
              cursor: "pointer", marginBottom: 16, padding: 0,
            }}
          >
            ← Back to Map
          </button>

          {/* Shelter info row */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            {shelter?.logo ? (
              <img src={shelter.logo} alt="" style={{
                width: 56, height: 56, borderRadius: 14, objectFit: "cover",
                border: "2px solid #e5e7eb", flexShrink: 0,
              }} />
            ) : (
              <div style={{
                width: 56, height: 56, borderRadius: 14, background: "#fff7ed",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28, flexShrink: 0, border: "2px solid #fed7aa",
              }}>🏠</div>
            )}
            <div style={{ flex: 1 }}>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1c1917" }}>
                {shelter?.organizationName}
              </h1>
              <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: 13, display: "flex", gap: 16, flexWrap: "wrap" }}>
                <span>📍 {shelter?.district}, {shelter?.province}</span>
                <span>📞 {shelter?.phone}</span>
              </p>
            </div>

            {/* Stats inline */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[
                { label: "Total",     value: pets.length,                                                         emoji: "🐾" },
                { label: "Available", value: pets.filter(p => p.adoptionStatus === "Available").length,           emoji: "💚" },
                { label: "Dogs",      value: pets.filter(p => p.species === "Dog").length,                        emoji: "🐕" },
                { label: "Cats",      value: pets.filter(p => p.species === "Cat").length,                        emoji: "🐱" },
              ].map(s => (
                <div key={s.label} style={{
                  background: "#fff7ed", borderRadius: 12,
                  padding: "8px 14px", border: "1px solid #fed7aa",
                  textAlign: "center", minWidth: 60,
                }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#ea580c" }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: "#92400e", fontWeight: 600, marginTop: 2 }}>{s.emoji} {s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter / Search Bar ── */}
      <div style={{
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        padding: "12px 24px",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Search by name or breed…"
            style={{
              padding: "8px 14px", borderRadius: 10,
              border: "1.5px solid #e5e7eb",
              fontSize: 13, outline: "none", fontFamily: "inherit",
              width: 220, background: "#f9fafb", color: "#1c1917",
            }}
          />
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {speciesOptions.map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{
                padding: "7px 16px", borderRadius: 50, fontSize: 13, fontWeight: 600,
                border: `1.5px solid ${filter === s ? "#ea580c" : "#e5e7eb"}`,
                background: filter === s ? "#ea580c" : "#fff",
                color: filter === s ? "#fff" : "#374151",
                cursor: "pointer", fontFamily: "inherit",
                transition: "all 0.15s",
              }}>
                {SPECIES_EMOJI[s] || ""} {s}
              </button>
            ))}
          </div>
          <span style={{ marginLeft: "auto", fontSize: 13, color: "#6b7280", fontWeight: 500 }}>
            {filtered.length} pet{filtered.length !== 1 ? "s" : ""} found
          </span>
        </div>
      </div>

      {/* ── Pet Grid ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px 60px" }}>
        <h2 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 800, color: "#ea580c", textAlign: "center" }}>
          Meet Our Lovely Pets
        </h2>
        <p style={{ textAlign: "center", color: "#6b7280", fontSize: 14, marginBottom: 32 }}>
          Find your perfect companion and give them a loving home
        </p>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🐾</div>
            <p style={{ fontSize: 18, fontWeight: 700, color: "#374151" }}>No pets found</p>
            <p style={{ fontSize: 14, color: "#9ca3af", marginTop: 6 }}>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
            {filtered.map(pet => {
              const statusCfg = STATUS_MAP[pet.adoptionStatus] || STATUS_MAP.Available;
              const imgUrl = pet.photos?.[0]?.url || pet.imageUrl;
              return (
                <div
                  key={pet._id}
                  onClick={() => navigate(`/pet-profile/${pet._id}`)}
                  style={{
                    background: "#fff", borderRadius: 20, overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                    cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s",
                    border: "1px solid #e5e7eb",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.13)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)";
                  }}
                >
                  {/* Photo */}
                  <div style={{ height: 200, background: "#fef9c3", position: "relative", overflow: "hidden" }}>
                    {imgUrl ? (
                      <img src={imgUrl} alt={pet.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 72 }}>
                        {SPECIES_EMOJI[pet.species] || "🐾"}
                      </div>
                    )}
                    <div style={{
                      position: "absolute", top: 12, right: 12,
                      background: statusCfg.bg, color: statusCfg.color,
                      border: `1.5px solid ${statusCfg.border}`,
                      borderRadius: 20, padding: "4px 12px",
                      fontSize: 11, fontWeight: 700,
                    }}>
                      {pet.adoptionStatus}
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ padding: "16px 18px 18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#ea580c" }}>{pet.name}</h3>
                      <span style={{
                        fontSize: 11, fontWeight: 600, color: "#6b7280",
                        background: "#f3f4f6", borderRadius: 8, padding: "3px 9px",
                      }}>{pet.gender}</span>
                    </div>
                    <p style={{ margin: "0 0 10px", fontSize: 13, color: "#6b7280" }}>
                      {pet.breed} · {pet.age} · {pet.size}
                    </p>

                    {pet.description && (
                      <p style={{
                        margin: "0 0 10px", fontSize: 13, color: "#4b5563", lineHeight: 1.5,
                        display: "-webkit-box", WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical", overflow: "hidden",
                      }}>
                        {pet.description}
                      </p>
                    )}

                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                      {pet.isNeuteredOrSpayed && <span style={tagStyle}>✂️ Neutered</span>}
                      {pet.isMicrochipped     && <span style={tagStyle}>📡 Chipped</span>}
                      {pet.isHouseTrained     && <span style={tagStyle}>🏠 Trained</span>}
                      {pet.specialNeeds       && <span style={{ ...tagStyle, background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}>❤️ Special Needs</span>}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: "#ea580c" }}>
                        {pet.adoptionFee === 0 ? "Free Adoption" : pet.adoptionFee ? `$${pet.adoptionFee} fee` : ""}
                      </span>
                      <button style={{
                        background: "#ea580c", color: "#fff", border: "none",
                        borderRadius: 10, padding: "8px 16px",
                        fontSize: 13, fontWeight: 700, cursor: "pointer",
                      }}>
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
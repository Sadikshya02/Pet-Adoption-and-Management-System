import React from "react";

const STATUS_CONFIG = {
  accepting_adoptions: { label: "Accepting Adoptions", color: "#22c55e", bg: "#f0fdf4" },
  by_appointment: { label: "By Appointment", color: "#f59e0b", bg: "#fffbeb" },
  intake_full: { label: "Intake Full", color: "#ef4444", bg: "#fef2f2" },
  closed: { label: "Closed", color: "#6b7280", bg: "#f9fafb" },
};

const btn = (bg, color, border = "none") => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  fontSize: 12,
  fontWeight: 600,
  padding: "7px 12px",
  borderRadius: 8,
  textDecoration: "none",
  background: bg,
  color,
  border,
  whiteSpace: "nowrap",
  cursor: "pointer",
});

const ShelterPopup = ({ shelter }) => {
  const cfg = STATUS_CONFIG[shelter.shelterStatus] || STATUS_CONFIG.accepting_adoptions;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shelter.fullAddress + ", Nepal")}`;
  const petCounts = shelter.petCounts || {};

  return (
    <div style={{ padding: 16, fontFamily: "Inter, system-ui, sans-serif", color: "#1e293b", width: 300 }}>

      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <div style={{ fontSize: 26, background: "#f1f5f9", borderRadius: 10, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          🏠
        </div>
        <div style={{ minWidth: 0 }}>
          <h2 style={{ margin: "0 0 3px", fontSize: 14, fontWeight: 700, color: "#0f172a", lineHeight: 1.3 }}>
            {shelter.organizationName}
          </h2>
          <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}>
            📍 {shelter.district}, {shelter.province}
          </p>
        </div>
      </div>

      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, border: `1.5px solid ${cfg.color}`, color: cfg.color, background: cfg.bg, marginBottom: 12 }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color, display: "inline-block" }} />
        {cfg.label}
      </div>

      <div style={{ display: "flex", background: "#f8faff", borderRadius: 12, border: "1px solid #e2e8f0", marginBottom: 12, overflow: "hidden" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 8px", gap: 2 }}>
          <span style={{ fontSize: 20 }}>🐕</span>
          <span style={{ fontSize: 20, fontWeight: 800, lineHeight: 1, color: "#0f172a" }}>{petCounts.dogs ?? 0}</span>
          <span style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>Dogs</span>
        </div>
        <div style={{ width: 1, background: "#e2e8f0", margin: "10px 0" }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 8px", gap: 2 }}>
          <span style={{ fontSize: 20 }}>🐈</span>
          <span style={{ fontSize: 20, fontWeight: 800, lineHeight: 1, color: "#0f172a" }}>{petCounts.cats ?? 0}</span>
          <span style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>Cats</span>
        </div>
      </div>

      <p style={{ fontSize: 11, color: "#475569", margin: "0 0 4px" }}>📍 {shelter.fullAddress}</p>
      <p style={{ fontSize: 11, color: "#475569", margin: "0 0 12px" }}>📞 {shelter.phone}</p>

      <div style={{ display: "flex", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
        <a href={`/shelter/${shelter._id}/pets`} style={{ ...btn("#2563eb", "#fff"), flex: 1, justifyContent: "center" }}>
          🐾 View Pets
        </a>
        <a href={`tel:${shelter.phone}`} style={btn("#f1f5f9", "#334155", "1px solid #e2e8f0")}>
          📞 Call
        </a>
        <a href={mapsUrl} target="_blank" rel="noreferrer" style={btn("#f1f5f9", "#334155", "1px solid #e2e8f0")}>
          🗺️ Directions
        </a>
      </div>

      {(shelter.volunteerUrl || shelter.donateUrl) && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {shelter.volunteerUrl && (
            <a href={shelter.volunteerUrl} target="_blank" rel="noreferrer" style={btn("transparent", "#475569", "1px solid #e2e8f0")}>
              🤝 Volunteer
            </a>
          )}
          {shelter.donateUrl && (
            <a href={shelter.donateUrl} target="_blank" rel="noreferrer" style={btn("transparent", "#dc2626", "1px solid #fecaca")}>
              ❤️ Donate
            </a>
          )}
        </div>
      )}

    </div>
  );
};

export default ShelterPopup;
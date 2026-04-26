import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useShelterMap } from "../hooks/useShelterMap";
import ShelterPopup from "./ShelterPopup";

// Fix Leaflet broken icons in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).href,
  iconUrl:       new URL("leaflet/dist/images/marker-icon.png",    import.meta.url).href,
  shadowUrl:     new URL("leaflet/dist/images/marker-shadow.png",  import.meta.url).href,
});

const NEPAL_CENTER = [28.3949, 84.124];

const STATUS_COLORS = {
  accepting_adoptions: "#22c55e",
  by_appointment:      "#f59e0b",
  intake_full:         "#ef4444",
  closed:              "#6b7280",
};

const STATUS_CONFIG = {
  accepting_adoptions: { label: "Accepting Adoptions", color: "#22c55e" },
  by_appointment:      { label: "By Appointment",      color: "#f59e0b" },
  intake_full:         { label: "Intake Full",          color: "#ef4444" },
  closed:              { label: "Closed",               color: "#6b7280" },
};

const LEGEND = [
  { label: "Accepting",    color: "#22c55e" },
  { label: "By Appt",     color: "#f59e0b" },
  { label: "Intake Full", color: "#ef4444" },
  { label: "Closed",      color: "#6b7280" },
];

// ── Filter options ──────────────────────────────────────────────────────────
const FILTERS = [
  { key: "all",                 label: "All" },
  { key: "accepting_adoptions", label: "Accepting" },
  { key: "by_appointment",      label: "By Appt" },
  { key: "intake_full",         label: "Intake Full" },
  { key: "closed",              label: "Closed" },
];

// ── Animated pin icon ───────────────────────────────────────────────────────
const createIcon = (shelterStatus, isNew = false) => {
  const fill = STATUS_COLORS[shelterStatus] || "#22c55e";
  const pulseRing = isNew
    ? `<circle cx="18" cy="18" r="14" fill="none" stroke="${fill}" stroke-width="3" opacity="0.5">
         <animate attributeName="r" from="10" to="22" dur="1.2s" repeatCount="indefinite"/>
         <animate attributeName="opacity" from="0.6" to="0" dur="1.2s" repeatCount="indefinite"/>
       </circle>`
    : "";
  return L.divIcon({
    html: `
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="56" viewBox="0 0 36 56" overflow="visible">
        ${pulseRing}
        <path d="M18 0C8.059 0 0 8.059 0 18c0 13.5 18 26 18 26S36 31.5 36 18C36 8.059 27.941 0 18 0z"
              fill="${fill}" stroke="rgba(0,0,0,0.15)" stroke-width="0.5"
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.25))"/>
        <circle cx="18" cy="18" r="9" fill="white" opacity="0.92"/>
        <text x="18" y="22" text-anchor="middle" font-size="11" font-family="sans-serif">🐾</text>
      </svg>`,
    className: "",
    iconSize:    [36, 44],
    iconAnchor:  [18, 44],
    popupAnchor: [0, -46],
  });
};

// ── FlyTo helper ────────────────────────────────────────────────────────────
const FlyTo = ({ target }) => {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, 14, { duration: 1.2 });
  }, [target, map]);
  return null;
};

// ── Main component ──────────────────────────────────────────────────────────
const ShelterMap = () => {
  const { shelters, loading, error, connected } = useShelterMap();

  const [flyTarget,    setFlyTarget]    = useState(null);
  const [query,        setQuery]        = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [newIds,       setNewIds]       = useState(new Set());

  const markerRefs    = useRef({});
  const prevShelterIds = useRef(new Set());

  // Track newly added shelters for the pulse animation
  useEffect(() => {
    const currentIds = new Set(shelters.map((s) => s._id));
    const added = [];
    currentIds.forEach((id) => {
      if (!prevShelterIds.current.has(id)) added.push(id);
    });
    if (added.length) {
      setNewIds((prev) => new Set([...prev, ...added]));
      // Remove pulse after 6 s
      setTimeout(() => {
        setNewIds((prev) => {
          const next = new Set(prev);
          added.forEach((id) => next.delete(id));
          return next;
        });
      }, 6000);
    }
    prevShelterIds.current = currentIds;
  }, [shelters]);

  // ── Filtered view ──────────────────────────────────────────────────────
  const statusFiltered = activeFilter === "all"
    ? shelters
    : shelters.filter((s) => s.shelterStatus === activeFilter);

  const searchFiltered = query.trim()
    ? statusFiltered.filter((s) =>
        s.organizationName?.toLowerCase().includes(query.toLowerCase()) ||
        s.district?.toLowerCase().includes(query.toLowerCase()) ||
        s.fullAddress?.toLowerCase().includes(query.toLowerCase())
      )
    : statusFiltered;

  // Dropdown only uses the status-filtered list (not the map-rendered one)
  const dropdownResults = query.trim()
    ? statusFiltered.filter((s) =>
        s.organizationName?.toLowerCase().includes(query.toLowerCase()) ||
        s.district?.toLowerCase().includes(query.toLowerCase()) ||
        s.fullAddress?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelect = useCallback((shelter) => {
    const [lng, lat] = shelter.location.coordinates;
    setFlyTarget([lat, lng]);
    setQuery("");
    setTimeout(() => markerRefs.current[shelter._id]?.openPopup(), 1300);
  }, []);

  // ── Shelter count summary ──────────────────────────────────────────────
  const totalDogs = shelters.reduce((a, s) => a + (s.petCounts?.dogs ?? 0), 0);
  const totalCats = shelters.reduce((a, s) => a + (s.petCounts?.cats ?? 0), 0);

  // ── Loading / error ────────────────────────────────────────────────────
  if (loading) return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", height: "calc(100vh - 64px)", gap: 12, color: "#64748b",
    }}>
      <div style={{
        width: 40, height: 40, border: "3px solid #e2e8f0",
        borderTopColor: "#3b82f6", borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      <p style={{ margin: 0 }}>Loading Nepal shelters…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", height: "calc(100vh - 64px)", gap: 8, color: "#64748b",
    }}>
      <span style={{ fontSize: 32 }}>⚠️</span>
      <p style={{ margin: 0 }}>{error}</p>
    </div>
  );

  return (
    <div style={{
      position: "relative", width: "100%", height: "calc(100vh - 64px)",
      display: "flex", flexDirection: "column",
      fontFamily: "Inter, system-ui, sans-serif",
    }}>

      {/* ── Top bar ────────────────────────────────────────────────────── */}
      <div style={{
        background: "#1a1f2e", color: "#fff", height: 52,
        display: "flex", alignItems: "center", gap: 16, padding: "0 20px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.35)", zIndex: 1000, flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <span style={{ fontSize: 20 }}>🐾</span>
          <h1 style={{ margin: 0, fontSize: 14, fontWeight: 700, whiteSpace: "nowrap" }}>
            Nepal Shelter Map
          </h1>
        </div>

        {/* Search */}
        <div style={{ flex: 1, maxWidth: 360, position: "relative" }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by shelter name or district…"
            style={{
              width: "100%", padding: "6px 14px", borderRadius: 8,
              border: "1.5px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.08)", color: "#fff",
              fontSize: 13, outline: "none", boxSizing: "border-box",
            }}
          />
          {query && (
            <div style={{
              position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
              background: "#fff", borderRadius: 10,
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)", overflow: "hidden", zIndex: 2000,
            }}>
              {dropdownResults.slice(0, 6).map((s) => {
                const cfg = STATUS_CONFIG[s.shelterStatus];
                return (
                  <button
                    key={s._id}
                    onClick={() => handleSelect(s)}
                    style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      width: "100%", padding: "10px 14px", border: "none",
                      borderBottom: "1px solid #f1f5f9", background: "transparent",
                      cursor: "pointer", textAlign: "left", gap: 8,
                    }}
                  >
                    <div>
                      <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1e293b" }}>
                        {s.organizationName}
                      </span>
                      <span style={{ fontSize: 11, color: "#64748b" }}>
                        {s.district}, {s.province}
                      </span>
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 20,
                      border: `1px solid ${cfg?.color}`, color: cfg?.color,
                      whiteSpace: "nowrap", flexShrink: 0,
                    }}>
                      {cfg?.label}
                    </span>
                  </button>
                );
              })}
              {dropdownResults.length === 0 && (
                <div style={{ padding: "10px 14px", fontSize: 13, color: "#94a3b8" }}>
                  No shelters found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pet count summary */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          fontSize: 12, color: "rgba(255,255,255,0.7)", flexShrink: 0,
        }}>
          <span>🐕 {totalDogs}</span>
          <span>🐈 {totalCats}</span>
        </div>

        {/* Live indicator + shelter count */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          fontSize: 12, color: "rgba(255,255,255,0.6)", flexShrink: 0,
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: "50%",
            background: connected ? "#22c55e" : "#ef4444",
            display: "inline-block",
            boxShadow: connected ? "0 0 0 3px rgba(34,197,94,0.3)" : "none",
          }} />
          <span>{connected ? "Live" : "Reconnecting…"}</span>
          <span style={{
            background: "rgba(255,255,255,0.1)", padding: "3px 8px",
            borderRadius: 20, fontSize: 11,
          }}>
            {searchFiltered.length} / {shelters.length} shelters
          </span>
        </div>
      </div>

      {/* ── Filter bar ─────────────────────────────────────────────────── */}
      <div style={{
        display: "flex", gap: 8, padding: "8px 16px",
        background: "#f8fafc", borderBottom: "1px solid #e2e8f0",
        flexShrink: 0, flexWrap: "wrap", alignItems: "center",
      }}>
        <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Filter:</span>
        {FILTERS.map(({ key, label }) => {
          const isActive = activeFilter === key;
          const color    = key === "all" ? "#3b82f6" : STATUS_COLORS[key];
          return (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                fontSize: 12, fontWeight: 600, padding: "4px 12px",
                borderRadius: 20, border: `1.5px solid ${isActive ? color : "#e2e8f0"}`,
                background: isActive ? color : "#fff",
                color: isActive ? "#fff" : "#475569",
                cursor: "pointer", transition: "all 0.15s",
              }}
            >
              {key !== "all" && (
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: isActive ? "#fff" : STATUS_COLORS[key],
                  display: "inline-block",
                }} />
              )}
              {label}
              {key !== "all" && (
                <span style={{
                  background: isActive ? "rgba(255,255,255,0.25)" : "#f1f5f9",
                  color: isActive ? "#fff" : "#64748b",
                  borderRadius: 10, padding: "0 5px", fontSize: 10,
                }}>
                  {shelters.filter((s) => s.shelterStatus === key).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Map ────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, position: "relative" }}>
        <MapContainer
          center={NEPAL_CENTER}
          zoom={7}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="bottomright" />
          <FlyTo target={flyTarget} />

          {searchFiltered.map((shelter) => {
            if (!shelter.location?.coordinates?.length) return null;
            const [lng, lat] = shelter.location.coordinates;
            return (
              <Marker
                key={shelter._id}
                position={[lat, lng]}
                icon={createIcon(shelter.shelterStatus, newIds.has(shelter._id))}
                ref={(r) => { if (r) markerRefs.current[shelter._id] = r; }}
              >
                <Popup maxWidth={320} minWidth={300}>
                  <ShelterPopup shelter={shelter} />
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* ── Legend ─────────────────────────────────────────────────── */}
        <div style={{
          position: "absolute", bottom: 32, left: 16, zIndex: 1000,
          background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)",
          borderRadius: 10, padding: "10px 14px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
          fontSize: 12, color: "#334155",
          display: "flex", flexDirection: "column", gap: 6,
        }}>
          {LEGEND.map(({ label, color }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                width: 10, height: 10, borderRadius: "50%",
                background: color, flexShrink: 0, display: "inline-block",
              }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* ── Override Leaflet popup styles ───────────────────────────── */}
      <style>{`
        .leaflet-popup-content-wrapper {
          padding: 0 !important;
          border-radius: 14px !important;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18) !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          width: auto !important;
        }
        .leaflet-container a.leaflet-popup-close-button {
          top: 8px !important;
          right: 10px !important;
          font-size: 18px !important;
          color: #94a3b8 !important;
        }
      `}</style>
    </div>
  );
};

export default ShelterMap;
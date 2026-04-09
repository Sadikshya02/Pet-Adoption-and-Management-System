import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MapPin, X } from "lucide-react";
import axios from "axios";

const API = "http://localhost:4000/api";

const COLOR_PAIRS = [
  { color: "#FFF0E6", textColor: "#E07B39" },
  { color: "#E1F5EE", textColor: "#0F6E56" },
  { color: "#FAEEDA", textColor: "#854F0B" },
  { color: "#E6F1FB", textColor: "#185FA5" },
  { color: "#FBEAF0", textColor: "#993556" },
  { color: "#F0EEFF", textColor: "#5B4DB8" },
];

function getEmoji(species = "") {
  const s = species.toLowerCase();
  if (s.includes("cat"))    return "🐱";
  if (s.includes("rabbit")) return "🐰";
  if (s.includes("bird"))   return "🦜";
  return "🐶";
}

const SPECIES_TABS = ["All", "Dog", "Cat", "Other Pets"];

function PetCard({ pet, index, onUnsave }) {
  const [removing, setRemoving] = useState(false);
  const pair = COLOR_PAIRS[index % COLOR_PAIRS.length];

  const handleUnsave = () => {
    setRemoving(true);
    setTimeout(() => onUnsave(pet.savedId), 350);
  };

  return (
    <div style={{
      background: "#fff", borderRadius: 18, border: "1px solid #F0EDE8",
      overflow: "hidden", display: "flex", flexDirection: "column",
      transition: "transform 0.2s, box-shadow 0.2s, opacity 0.35s",
      opacity: removing ? 0 : 1,
      transform: removing ? "scale(0.95)" : "scale(1)",
      cursor: "pointer",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = removing ? "scale(0.95)" : "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.08)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      {/* Image / emoji area */}
      <div style={{
        background: pair.color, height: 110,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 52, position: "relative", overflow: "hidden",
      }}>
        {pet.imageUrl
          ? <img src={pet.imageUrl} alt={pet.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : getEmoji(pet.species)
        }

        {/* Unsave button */}
        <button
          onClick={(e) => { e.stopPropagation(); handleUnsave(); }}
          title="Remove from saved"
          style={{
            position: "absolute", top: 10, right: 10,
            width: 32, height: 32, borderRadius: "50%",
            background: "rgba(255,255,255,0.92)", border: "none",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.2s, transform 0.15s", zIndex: 1,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#FFEBEE"; e.currentTarget.style.transform = "scale(1.1)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.92)"; e.currentTarget.style.transform = "scale(1)"; }}
        >
          <X size={14} color="#E53935" />
        </button>

        {/* Gender badge */}
        {pet.gender && (
          <span style={{
            position: "absolute", bottom: 10, left: 10,
            fontSize: 11, fontWeight: 600,
            background: "rgba(255,255,255,0.92)",
            color: pet.gender === "Female" ? "#993556" : "#185FA5",
            padding: "2px 9px", borderRadius: 10,
          }}>
            {pet.gender === "Female" ? "♀" : "♂"} {pet.gender}
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "14px 16px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#1E1E1C", marginBottom: 2 }}>{pet.name}</div>
          <div style={{ fontSize: 13, color: "#999" }}>{pet.breed}{pet.age ? ` · ${pet.age}` : ""}</div>
        </div>

        {pet.location && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 5 }}>
            <MapPin size={12} color="#BBB" style={{ marginTop: 2, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "#BBB", lineHeight: 1.4 }}>{pet.location}</span>
          </div>
        )}

        {pet.tags?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {pet.tags.map(tag => (
              <span key={tag} style={{
                fontSize: 11, fontWeight: 500,
                background: pair.color, color: pair.textColor,
                padding: "3px 9px", borderRadius: 10,
              }}>{tag}</span>
            ))}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#E07B39", fontWeight: 500, marginTop: 2 }}>
          <Heart size={13} fill="#E07B39" color="#E07B39" /> Saved
        </div>
      </div>
    </div>
  );
}

export default function SavedPets() {
  const navigate = useNavigate();
  const [pets, setPets]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (!user?._id) return navigate("/login");

        const { data } = await axios.get(`${API}/saved-pets`, {
          params: { userId: user._id },
          withCredentials: true,
        });
        setPets(data);
      } catch (err) {
        console.error("SavedPets error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, []);

  const handleUnsave = async (savedId) => {
    try {
      await axios.delete(`${API}/saved-pets/${savedId}`, { withCredentials: true });
      setPets(prev => prev.filter(p => p.savedId !== savedId));
    } catch (err) {
      console.error("Unsave error:", err.message);
    }
  };

  const normalize = (species = "") => {
    const s = species.toLowerCase();
    if (s.includes("dog")) return "Dog";
    if (s.includes("cat")) return "Cat";
    return "Other Pets";
  };

  const counts = {
    All:         pets.length,
    Dog:         pets.filter(p => normalize(p.species) === "Dog").length,
    Cat:         pets.filter(p => normalize(p.species) === "Cat").length,
    "Other Pets":pets.filter(p => normalize(p.species) === "Other Pets").length,
  };

  const filtered = filter === "All" ? pets : pets.filter(p => normalize(p.species) === filter);

  return (
    <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: "#FAF8F5", minHeight: "100vh", padding: "2.5rem 2rem" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap'); * { box-sizing: border-box; }`}</style>

      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "'Lora', serif", fontSize: 26, fontWeight: 700, color: "#1E1E1C", margin: "0 0 6px", display: "flex", alignItems: "center", gap: 10 }}>
            <Heart size={24} color="#E07B39" fill="#E07B39" /> Saved Pets
          </h1>
          <p style={{ fontSize: 14, color: "#999", margin: 0 }}>
            {pets.length} pet{pets.length !== 1 ? "s" : ""} saved to your wishlist.
          </p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {SPECIES_TABS.map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: "7px 16px", borderRadius: 20, fontSize: 13, fontWeight: 500,
              fontFamily: "inherit", cursor: "pointer",
              border: filter === s ? "1.5px solid #E07B39" : "1.5px solid #F0EDE8",
              background: filter === s ? "#FFF0E6" : "#fff",
              color: filter === s ? "#E07B39" : "#888",
              transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6,
            }}>
              {s === "Dog" ? "🐶" : s === "Cat" ? "🐱" : s === "Other Pets" ? "🐾" : "🐾"} {s}
              <span style={{
                background: filter === s ? "#E07B39" : "#F0EDE8",
                color: filter === s ? "#fff" : "#AAA",
                fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 10,
              }}>{counts[s]}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#AAA", fontSize: 15 }}>Loading saved pets... 🐾</div>
        ) : filtered.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #F0EDE8", padding: "56px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>💔</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#2C2C2A", marginBottom: 6 }}>No saved {filter !== "All" ? filter.toLowerCase() + "s" : "pets"} yet</div>
            <div style={{ fontSize: 13, color: "#AAA" }}>Start exploring and save pets you love!</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
            {filtered.map((pet, i) => (
              <PetCard key={pet._id} pet={pet} index={i} onUnsave={handleUnsave} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
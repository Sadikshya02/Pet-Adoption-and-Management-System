import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Heart, PawPrint, Shield, Syringe, Scissors, CheckCircle, Baby, Cat, Dog } from "lucide-react";
import axios from "axios";

const HEALTH_ITEMS = [
  { key: "vaccinated",   label: "Vaccinated",       icon: Syringe     },
  { key: "neutered",     label: "Neutered / Spayed", icon: Scissors    },
  { key: "microchipped", label: "Microchipped",      icon: Shield      },
  { key: "dewormed",     label: "Dewormed",          icon: CheckCircle },
];

const COMPAT_ITEMS = [
  { key: "kids", label: "Good with Kids", icon: Baby },
  { key: "cats", label: "Good with Cats", icon: Cat  },
  { key: "dogs", label: "Good with Dogs", icon: Dog  },
];

export default function PetDetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const [pet, setPet]           = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saved, setSaved]       = useState(false);
  const [applied, setApplied]   = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError]       = useState("");

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/pets/${id}`,
          { withCredentials: true }
        );
        setPet(data);

        // Check if user already applied for this pet
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user?._id) {
          const { data: adoptions } = await axios.get(
            "http://localhost:4000/api/adoptions",
            { withCredentials: true }
          );
          const alreadyApplied = adoptions.some(
            a => a.petId === data._id.toString() && a.email === user.email
          );
          setApplied(alreadyApplied);
        }

        // Check if user already saved this pet
        if (user?._id) {
          const { data: savedPets } = await axios.get(
            "http://localhost:4000/api/saved-pets",
            { params: { userId: user._id }, withCredentials: true }
          );
          const alreadySaved = savedPets.some(p => p._id === data._id.toString());
          setSaved(alreadySaved);
        }

      } catch (err) {
        console.error(err);
        setError("Pet not found");
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [id]);

  const handleApply = async () => {
    if (applied || applying) return;
    try {
      setApplying(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user?._id) return navigate("/login");

      const payload = {
        petId:   pet._id,
        petName: pet.name,
        name:    user.name         || "Unknown",
        email:   user.email        || "unknown@email.com",
        phone:   user.phoneNumber  || "",
        note:    "",
        userId:  user._id,   // ← so notifications work
      };

      await axios.post("http://localhost:4000/api/adoptions", payload, {
        withCredentials: true,
      });
      setApplied(true);
      alert("Application sent successfully! The shelter will contact you within 3–5 days.");
    } catch (err) {
      console.error(err);
      alert("Error: " + (err.response?.data?.message || "Something went wrong. Try again."));
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user?._id) return navigate("/login");

      if (saved) {
        // Find the savedId and delete it
        const { data: savedPets } = await axios.get(
          "http://localhost:4000/api/saved-pets",
          { params: { userId: user._id }, withCredentials: true }
        );
        const match = savedPets.find(p => p._id === pet._id.toString());
        if (match?.savedId) {
          await axios.delete(
            `http://localhost:4000/api/saved-pets/${match.savedId}`,
            { withCredentials: true }
          );
        }
        setSaved(false);
      } else {
        await axios.post(
          "http://localhost:4000/api/saved-pets",
          { userId: user._id, petId: pet._id },
          { withCredentials: true }
        );
        setSaved(true);
      }
    } catch (err) {
      console.error("Save error:", err.message);
    }
  };

  if (loading) return (
    <div style={{ padding: "4rem", textAlign: "center", fontSize: 18, color: "#888" }}>
      Loading pet details... 🐾
    </div>
  );

  if (error || !pet) return <NotFound navigate={navigate} />;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#FAF8F5", minHeight: "100vh", padding: "2.5rem 2rem" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
        <BackButton navigate={navigate} />
        <HeroCard
          pet={pet}
          saved={saved}
          handleSave={handleSave}
          applied={applied}
          handleApply={handleApply}
          loading={applying}
        />
        <AboutSection pet={pet} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <HealthCard health={pet.health} />
          <PersonalityCard traits={pet.tags || []} />
        </div>
        <CompatibilityCard compatibility={pet.traits?.suitableFor} />
        <ApplyBar pet={pet} applied={applied} handleApply={handleApply} loading={applying} />
      </div>
    </div>
  );
}

function AboutSection({ pet }) {
  return (
    <div style={cardStyle}>
      <SectionTitle>About {pet.name}</SectionTitle>
      <p style={{ fontSize: 14, color: "#555", lineHeight: 1.75, margin: 0 }}>
        {pet.description || "No description available."}
      </p>
      <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
        {[
          { label: "Species", value: pet.species },
          { label: "Breed",   value: pet.breed   },
          { label: "Age",     value: pet.age      },
          { label: "Gender",  value: pet.gender   },
          { label: "Status",  value: pet.status   },
        ].map(({ label, value }) => value ? (
          <div key={label} style={{ background: "#f9fafb", borderRadius: 10, padding: "8px 14px", fontSize: 13 }}>
            <span style={{ color: "#888" }}>{label}: </span>
            <span style={{ fontWeight: 600, textTransform: "capitalize" }}>{value}</span>
          </div>
        ) : null)}
      </div>
    </div>
  );
}

function HealthCard({ health }) {
  return (
    <div style={cardStyle}>
      <SectionTitle>Health & Care</SectionTitle>
      {!health ? (
        <p style={{ fontSize: 13, color: "#aaa" }}>Health info not available.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {HEALTH_ITEMS.map(({ key, label, icon: Icon }) => {
            const checked = health?.[key];
            return (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: checked ? "#EAF3DE" : "#F5F5F5",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Icon size={15} color={checked ? "#4A8C1C" : "#BBBBBB"} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: checked ? "#333" : "#BBBBBB" }}>
                  {label}
                </span>
                {!checked && (
                  <span style={{ fontSize: 11, color: "#CCC", marginLeft: "auto" }}>Not confirmed</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PersonalityCard({ traits = [] }) {
  const tagColors = [
    { bg: "#FFF3E0", text: "#B05E00" },
    { bg: "#E8F5E9", text: "#2E7D32" },
    { bg: "#E3F2FD", text: "#1565C0" },
    { bg: "#FCE4EC", text: "#AD1457" },
    { bg: "#F3E5F5", text: "#6A1B9A" },
  ];
  return (
    <div style={cardStyle}>
      <SectionTitle>Personality & Tags</SectionTitle>
      {traits.length === 0 ? (
        <p style={{ fontSize: 13, color: "#aaa" }}>No tags available.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {traits.map((trait, i) => {
            const c = tagColors[i % tagColors.length];
            return (
              <span key={trait} style={{
                background: c.bg, color: c.text,
                fontSize: 12, fontWeight: 600,
                padding: "5px 12px", borderRadius: 20,
              }}>
                {trait}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CompatibilityCard({ compatibility }) {
  return (
    <div style={cardStyle}>
      <SectionTitle>Compatibility</SectionTitle>
      {!compatibility ? (
        <p style={{ fontSize: 13, color: "#aaa" }}>Compatibility info not available.</p>
      ) : (
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {COMPAT_ITEMS.map(({ key, label, icon: Icon }) => {
            const ok = compatibility?.[key];
            return (
              <div key={key} style={{
                flex: "1 1 120px",
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: 8, padding: "16px 12px",
                background: ok ? "#EAF3DE" : "#FBF3F0",
                borderRadius: 14,
                border: `1px solid ${ok ? "#C5E3A0" : "#F3D9CF"}`,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: ok ? "#D4EDBA" : "#F5CFC4",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={18} color={ok ? "#4A8C1C" : "#C0572A"} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: ok ? "#3B6D11" : "#8B3A20", textAlign: "center" }}>
                  {label}
                </span>
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  color: ok ? "#4A8C1C" : "#C0572A",
                  background: ok ? "#C5E3A0" : "#F5CFC4",
                  padding: "2px 8px", borderRadius: 10,
                }}>
                  {ok ? "Yes" : "No"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const cardStyle = {
  background: "#fff", borderRadius: 20,
  border: "1px solid #F0EDE8", padding: "24px 28px",
};

function SectionTitle({ children }) {
  return (
    <div style={{ fontFamily: "'Lora', serif", fontSize: 16, fontWeight: 700, color: "#1A1A1A", marginBottom: 16 }}>
      {children}
    </div>
  );
}

function NotFound({ navigate }) {
  return (
    <div style={{ padding: "4rem", textAlign: "center" }}>
      <div style={{ fontSize: 48 }}>🐾</div>
      <div style={{ fontSize: 18, fontWeight: 600 }}>Pet not found</div>
      <button onClick={() => navigate(-1)} style={{ marginTop: 16, color: "#E07B39", background: "none", border: "none", cursor: "pointer" }}>
        ← Go back
      </button>
    </div>
  );
}

function BackButton({ navigate }) {
  return (
    <button onClick={() => navigate(-1)} style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #F0EDE8", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 600, color: "#888", cursor: "pointer" }}>
      <ArrowLeft size={15} /> Back
    </button>
  );
}

function HeroCard({ pet, saved, handleSave, applied, handleApply, loading }) {
  return (
    <div style={{ background: "#fff", borderRadius: 24, border: "1px solid #F0EDE8", overflow: "hidden" }}>
      {pet.imageUrl ? (
        <div style={{ width: "100%", height: 280, overflow: "hidden" }}>
          <img src={pet.imageUrl} alt={pet.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      ) : (
        <div style={{ width: "100%", height: 200, background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80 }}>
          {pet.emoji || "🐾"}
        </div>
      )}

      <div style={{ padding: "28px 32px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "'Lora', serif", fontSize: 28, fontWeight: 700, margin: "0 0 8px" }}>
            {pet.name}
          </h1>
          <div style={{ fontSize: 14, color: "#999", marginBottom: 12 }}>
            {pet.breed} · {pet.age} · {pet.gender}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleSave}
            style={{ display: "flex", alignItems: "center", gap: 7, background: saved ? "#FFF0E6" : "#fff", border: `1px solid ${saved ? "#FFD9BB" : "#F0EDE8"}`, borderRadius: 12, padding: "10px 18px", fontSize: 13, fontWeight: 600, color: saved ? "#E07B39" : "#888", cursor: "pointer" }}
          >
            <Heart size={15} fill={saved ? "#E07B39" : "none"} color={saved ? "#E07B39" : "#888"} />
            {saved ? "Saved" : "Save"}
          </button>
          <button
            onClick={handleApply}
            disabled={applied || loading}
            style={{ display: "flex", alignItems: "center", gap: 7, background: applied ? "#EAF3DE" : "#E07B39", border: "none", borderRadius: 12, padding: "10px 22px", fontSize: 13, fontWeight: 600, color: applied ? "#3B6D11" : "#fff", cursor: applied || loading ? "default" : "pointer" }}
          >
            <PawPrint size={15} />
            {loading ? "Applying..." : applied ? "✓ Application Sent" : "Apply to Adopt"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ApplyBar({ pet, applied, handleApply, loading }) {
  return (
    <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #F0EDE8", padding: "20px 28px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
      <div>
        <div style={{ fontFamily: "'Lora', serif", fontSize: 18, fontWeight: 700 }}>
          Ready to adopt {pet.name}?
        </div>
        <div style={{ fontSize: 13, color: "#999", marginTop: 3 }}>
          Submit your application and the shelter will contact you within 3–5 days.
        </div>
      </div>
      <button
        onClick={handleApply}
        disabled={applied || loading}
        style={{ display: "flex", alignItems: "center", gap: 8, background: applied ? "#EAF3DE" : "#E07B39", border: "none", borderRadius: 14, padding: "12px 28px", fontSize: 14, fontWeight: 600, color: applied ? "#3B6D11" : "#fff", cursor: applied || loading ? "default" : "pointer" }}
      >
        <PawPrint size={16} />
        {loading ? "Applying..." : applied ? "✓ Application Sent!" : "Apply to Adopt"}
      </button>
    </div>
  );
}
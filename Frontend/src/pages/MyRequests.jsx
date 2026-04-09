import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PawPrint, X, ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";

const STATUS_STYLES = {
  pending:  { bg: "#FAEEDA", color: "#854F0B", dot: "#EF9F27",  label: "Pending"  },
  approved: { bg: "#EAF3DE", color: "#3B6D11", dot: "#639922",  label: "Approved" },
  rejected: { bg: "#FCEBEB", color: "#A32D2D", dot: "#E24B4A",  label: "Rejected" },
};

// Build steps based on real status from DB
function buildSteps(adoption) {
  const status   = adoption.status;
  const created  = new Date(adoption.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const updated  = new Date(adoption.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return [
    {
      label: "Application Submitted",
      done:  true,
      date:  created,
    },
    {
      label: "Under Shelter Review",
      done:  status === "approved" || status === "rejected",
      date:  status === "approved" || status === "rejected" ? updated : null,
    },
    {
      label: "Meet & Greet Scheduled",
      done:  status === "approved",
      date:  status === "approved" ? updated : null,
    },
    {
      label: "Adoption Approved",
      done:  status === "approved",
      date:  status === "approved" ? updated : null,
    },
  ];
}

function Timeline({ steps, status }) {
  return (
    <div style={{ padding: "16px 0 4px", display: "flex", flexDirection: "column", gap: 0 }}>
      {steps.map((step, i) => {
        const isLast   = i === steps.length - 1;
        const isDone   = step.done;
        const isFailed = status === "rejected" && !isDone;

        return (
          <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
              <div style={{
                width: 22, height: 22, borderRadius: "50%",
                background: isDone ? "#E07B39" : isFailed ? "#FCEBEB" : "#F0EDE8",
                border: isDone ? "none" : isFailed ? "2px solid #E24B4A" : "2px solid #E0DDD8",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, color: isDone ? "#fff" : isFailed ? "#E24B4A" : "#CCC",
                fontWeight: 700, flexShrink: 0, transition: "all 0.2s",
              }}>
                {isDone ? "✓" : isFailed ? "✕" : i + 1}
              </div>
              {!isLast && (
                <div style={{
                  width: 2, height: 28,
                  background: isDone ? "#E07B39" : "#F0EDE8",
                  margin: "2px 0",
                }} />
              )}
            </div>
            <div style={{ paddingBottom: isLast ? 0 : 8 }}>
              <div style={{
                fontSize: 13, fontWeight: isDone ? 600 : 400,
                color: isDone ? "#2C2C2A" : isFailed ? "#CCC" : "#AAA",
                marginBottom: 2,
              }}>
                {step.label}
              </div>
              {step.date && (
                <div style={{ fontSize: 11, color: "#BBB" }}>{step.date}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RequestCard({ request, onCancel }) {
  const [expanded, setExpanded] = useState(false);
  const s         = STATUS_STYLES[request.status] || STATUS_STYLES.pending;
  const canCancel = request.status === "pending";
  const steps     = buildSteps(request);

  // Species emoji based on pet name guess or default
  const petEmoji  = request.petName?.toLowerCase().includes("cat") ? "🐱"
                  : request.petName?.toLowerCase().includes("rabbit") ? "🐰"
                  : "🐶";

  return (
    <div style={{
      background: "#fff", borderRadius: 18, border: "1px solid #F0EDE8", overflow: "hidden",
    }}>
      {/* Card header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 22px" }}>

        {/* Pet image or emoji */}
        <div style={{
          width: 56, height: 56, borderRadius: 14,
          background: "#FFF0E6",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28, flexShrink: 0, overflow: "hidden",
        }}>
          {request.petImage ? (
            <img src={request.petImage} alt={request.petName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : petEmoji}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#1E1E1C", marginBottom: 2 }}>
            {request.petName}
          </div>
          <div style={{ fontSize: 13, color: "#999", marginBottom: 6 }}>
            {request.name} · {request.email}
          </div>
          <div style={{ fontSize: 12, color: "#BBB" }}>
            Applied on {new Date(request.createdAt).toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric"
            })}
          </div>
        </div>

        {/* Status badge */}
        <span style={{
          fontSize: 12, fontWeight: 600, padding: "5px 14px", borderRadius: 20,
          background: s.bg, color: s.color,
          display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
          {s.label}
        </span>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: "#FAF8F5", border: "1px solid #F0EDE8",
            borderRadius: 10, padding: "6px 10px", cursor: "pointer",
            color: "#AAA", display: "flex", alignItems: "center",
            marginLeft: 8, flexShrink: 0,
          }}
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Expandable timeline + cancel */}
      {expanded && (
        <div style={{ borderTop: "1px solid #F0EDE8", padding: "4px 22px 20px" }}>
          <div style={{
            fontSize: 12, fontWeight: 600, color: "#AAA",
            textTransform: "uppercase", letterSpacing: "0.06em",
            marginTop: 14, marginBottom: 4,
          }}>
            Application Progress
          </div>
          <Timeline steps={steps} status={request.status} />

          {/* Note if any */}
          {request.note && (
            <div style={{ marginTop: 12, padding: "10px 14px", background: "#FAF8F5", borderRadius: 10, fontSize: 13, color: "#666" }}>
              <span style={{ fontWeight: 600 }}>Note: </span>{request.note}
            </div>
          )}

          {canCancel && (
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #F0EDE8" }}>
              <button
                onClick={() => onCancel(request._id)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "#FFF5F5", border: "1px solid #FFCDD2",
                  borderRadius: 10, padding: "8px 18px",
                  fontSize: 13, fontWeight: 600, color: "#E53935",
                  cursor: "pointer",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#FFEBEE"}
                onMouseLeave={e => e.currentTarget.style.background = "#FFF5F5"}
              >
                <X size={15} />
                Withdraw Application
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MyRequests() {
  const navigate = useNavigate();
  const [requests, setRequests]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [cancelledId, setCancelledId] = useState(null);
  const [filter, setFilter]       = useState("all");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (!user?._id) return navigate("/login");

        // Fetch all adoptions and filter by logged-in user's email
        const { data } = await axios.get(
          "http://localhost:4000/api/adoptions",
          { withCredentials: true }
        );

        const userRequests = data.filter(a => a.email === user.email);

        // For each request, try to get pet image
        const enriched = await Promise.all(
          userRequests.map(async (req) => {
            try {
              const { data: pet } = await axios.get(
                `http://localhost:4000/api/pets/${req.petId}`,
                { withCredentials: true }
              );
              return { ...req, petImage: pet.imageUrl || "" };
            } catch {
              return { ...req, petImage: "" };
            }
          })
        );

        setRequests(enriched);
      } catch (err) {
        console.error("MyRequests error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // ✅ Withdraw — just removes from UI (add DELETE route if needed)
  const handleCancel = (id) => {
    setCancelledId(id);
    setTimeout(() => {
      setRequests(prev => prev.filter(r => r._id !== id));
      setCancelledId(null);
    }, 400);
  };

  const counts = {
    all:      requests.length,
    pending:  requests.filter(r => r.status === "pending").length,
    approved: requests.filter(r => r.status === "approved").length,
    rejected: requests.filter(r => r.status === "rejected").length,
  };

  const filtered = filter === "all" ? requests : requests.filter(r => r.status === filter);

  const filterLabels = [
    { key: "all",      label: "All"      },
    { key: "pending",  label: "Pending"  },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      background: "#FAF8F5", minHeight: "100vh", padding: "2.5rem 2rem",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap'); * { box-sizing: border-box; }`}</style>

      <div style={{ maxWidth: 820, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{
            fontFamily: "'Lora', serif", fontSize: 26, fontWeight: 700,
            color: "#1E1E1C", margin: "0 0 6px",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <PawPrint size={24} color="#E07B39" />
            My Requests
          </h1>
          <p style={{ fontSize: 14, color: "#999", margin: 0 }}>
            Track and manage all your pet adoption applications.
          </p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {filterLabels.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                padding: "7px 16px", borderRadius: 20, fontSize: 13,
                fontWeight: 500, fontFamily: "inherit", cursor: "pointer",
                border: filter === key ? "1.5px solid #E07B39" : "1.5px solid #F0EDE8",
                background: filter === key ? "#FFF0E6" : "#fff",
                color: filter === key ? "#E07B39" : "#888",
                transition: "all 0.2s",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              {label}
              <span style={{
                background: filter === key ? "#E07B39" : "#F0EDE8",
                color: filter === key ? "#fff" : "#AAA",
                fontSize: 10, fontWeight: 700,
                padding: "1px 6px", borderRadius: 10,
              }}>
                {counts[key]}
              </span>
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#AAA", fontSize: 15 }}>
            Loading your requests... 🐾
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            background: "#fff", borderRadius: 18, border: "1px solid #F0EDE8",
            padding: "48px 24px", textAlign: "center",
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🐾</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#2C2C2A", marginBottom: 6 }}>
              No requests found
            </div>
            <div style={{ fontSize: 13, color: "#AAA" }}>
              You have no {filter !== "all" ? filter : ""} adoption applications yet.
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filtered.map(r => (
              <div
                key={r._id}
                style={{
                  opacity: cancelledId === r._id ? 0 : 1,
                  transform: cancelledId === r._id ? "translateX(30px)" : "none",
                  transition: "opacity 0.35s, transform 0.35s",
                }}
              >
                <RequestCard request={r} onCancel={handleCancel} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
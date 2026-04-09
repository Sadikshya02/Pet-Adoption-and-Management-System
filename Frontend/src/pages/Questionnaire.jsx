import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const questions = [
  {
    id: "energy",
    label: "How active is your daily lifestyle?",
    type: "slider",
    hint: "1 = very relaxed · 10 = very active",
  },
  {
    id: "social",
    label: "How much do you enjoy social interaction?",
    type: "slider",
    hint: "1 = introvert · 10 = very social",
  },
  {
    id: "maintenance",
    label: "How much time can you dedicate to pet care daily?",
    type: "slider",
    hint: "1 = minimal · 10 = lots of time",
  },
  {
    id: "livingSpace",
    label: "What's your living situation?",
    type: "select",
    options: [
      { value: "apartment",    label: "🏢 Apartment" },
      { value: "house_small",  label: "🏡 Small house" },
      { value: "house_large",  label: "🏠 Large house with yard" },
    ],
  },
  {
    id: "workSchedule",
    label: "What's your work schedule?",
    type: "select",
    options: [
      { value: "home",     label: "🏠 Work from home" },
      { value: "parttime", label: "⏰ Part-time / flexible" },
      { value: "fulltime", label: "💼 Full-time office" },
    ],
  },
  {
    id: "experience",
    label: "What's your pet ownership experience?",
    type: "select",
    options: [
      { value: "none",        label: "🌱 First-time owner" },
      { value: "some",        label: "📖 Had pets before" },
      { value: "experienced", label: "🏆 Very experienced" },
    ],
  },
  { id: "hasChildren",  label: "Do you have children at home?",                type: "boolean" },
  { id: "hasAllergies", label: "Do you or anyone at home have pet allergies?", type: "boolean" },
];

export default function Questionnaire() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    energy: 5, social: 5, maintenance: 5,
    livingSpace: "apartment", workSchedule: "fulltime",
    experience: "none", hasChildren: false, hasAllergies: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const current = questions[step];
  const isLast  = step === questions.length - 1;

  const handleChange = (val) => setAnswers((prev) => ({ ...prev, [current.id]: val }));

  const handleNext = async () => {
    if (!isLast) return setStep((s) => s + 1);

    setLoading(true);
    setError("");
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?._id) return navigate("/login");

      await axios.post(
        `http://localhost:4000/api/users/${user._id}/questionnaire`,
        answers,
        { withCredentials: true }
      );

      await axios.post(
        `http://localhost:4000/api/matches/run/${user._id}`,
        {},
        { withCredentials: true }
      );

      localStorage.setItem("user", JSON.stringify({ ...user, questionnaireCompleted: true }));

      navigate("/pet-matches");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h1 style={s.title}>🐾 Find Your Perfect Pet</h1>

        <div style={s.track}>
          <div style={{ ...s.fill, width: `${((step + 1) / questions.length) * 100}%` }} />
        </div>
        <p style={s.stepLabel}>Step {step + 1} of {questions.length}</p>

        <h2 style={s.question}>{current.label}</h2>

        {current.type === "slider" && (
          <div>
            <input
              type="range" min={1} max={10}
              value={answers[current.id]}
              onChange={(e) => handleChange(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#f97316" }}
            />
            <div style={s.sliderRow}>
              <span style={s.hint}>{current.hint?.split("·")[0]}</span>
              <span style={s.sliderVal}>{answers[current.id]}</span>
              <span style={s.hint}>{current.hint?.split("·")[1]}</span>
            </div>
          </div>
        )}

        {current.type === "select" && (
          <div style={s.optGroup}>
            {current.options.map((opt) => (
              <button
                key={opt.value}
                style={{ ...s.opt, ...(answers[current.id] === opt.value ? s.optActive : {}) }}
                onClick={() => handleChange(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {current.type === "boolean" && (
          <div style={s.optGroup}>
            {[{ value: true, label: "✅ Yes" }, { value: false, label: "❌ No" }].map((opt) => (
              <button
                key={String(opt.value)}
                style={{ ...s.opt, ...(answers[current.id] === opt.value ? s.optActive : {}) }}
                onClick={() => handleChange(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {error && <p style={{ color: "red", marginTop: "12px" }}>{error}</p>}

        <div style={s.nav}>
          {step > 0 && (
            <button style={s.backBtn} onClick={() => setStep((s) => s - 1)}>← Back</button>
          )}
          <button style={s.nextBtn} onClick={handleNext} disabled={loading}>
            {loading ? "Finding matches..." : isLast ? "Find My Matches 🐾" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}

const s = {
  page:      { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f4f8", padding: "20px" },
  card:      { background: "#fff", padding: "40px", borderRadius: "16px", width: "100%", maxWidth: "520px", boxShadow: "0 4px 24px rgba(0,0,0,0.1)" },
  title:     { textAlign: "center", fontSize: "24px", marginBottom: "20px" },
  track:     { height: "6px", background: "#e5e7eb", borderRadius: "99px", marginBottom: "8px" },
  fill:      { height: "6px", background: "#f97316", borderRadius: "99px", transition: "width 0.3s" },
  stepLabel: { color: "#888", fontSize: "13px", marginBottom: "24px" },
  question:  { fontSize: "20px", marginBottom: "28px", lineHeight: 1.4 },
  sliderRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" },
  sliderVal: { fontWeight: "bold", fontSize: "22px", color: "#f97316" },
  hint:      { fontSize: "12px", color: "#888" },
  optGroup:  { display: "flex", flexDirection: "column", gap: "10px" },
  opt:       { padding: "13px 16px", borderRadius: "10px", border: "2px solid #e5e7eb", background: "#fff", fontSize: "15px", cursor: "pointer", textAlign: "left" },
  optActive: { borderColor: "#f97316", background: "#fff7ed", color: "#f97316", fontWeight: "600" },
  nav:       { display: "flex", gap: "12px", marginTop: "32px" },
  nextBtn:   { flex: 1, padding: "13px", background: "#f97316", color: "#fff", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer" },
  backBtn:   { padding: "13px 20px", background: "#f3f4f6", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer" },
};
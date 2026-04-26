import { useState } from "react";

const sections = [
  {
    icon: "🐾",
    title: "Basic Commands",
    color: "#FFF3E0",
    accent: "#E65100",
    points: [
      "Sit: Hold a treat to your dog's nose, move your hand up — their bottom lowers. Say 'sit', reward. Repeat 5–10 times.",
      "Stay: Ask to sit, open palm toward them, say 'stay'. Step back, reward if they hold. Increase distance gradually.",
      "Come: Crouch down, open arms, say 'come' happily. Never call them for something unpleasant — it breaks recall.",
      "Leave it: Treat in both fists — when they stop sniffing one hand, say 'leave it' and reward from the other.",
      "Down: From sit, move a treat from nose to floor. As elbows touch down, say 'down' and reward immediately.",
    ],
  },
  {
    icon: "🏠",
    title: "Crate Training",
    color: "#FFF3E0",
    accent: "#E65100",
    points: [
      "Choose the right size: big enough to stand, turn, and lie down — not so large they toilet in one corner.",
      "Make it cozy: add a soft blanket, a worn t-shirt for your scent, and a safe chew toy inside.",
      "Start with short sessions: door open first, toss treats inside, then close for seconds — gradually build to longer stays.",
      "Never use as punishment: the crate must always be a positive space or it loses its value entirely.",
      "Nighttime: place the crate near your bed so puppies feel safe and you can hear them when they need a bathroom trip.",
    ],
  },
  {
    icon: "😰",
    title: "Separation Anxiety",
    color: "#FFF3E0",
    accent: "#E65100",
    points: [
      "Practice short departures: leave for 30 seconds, return calm. Gradually extend time. Don't make arrivals a big event.",
      "Tire them out first: a good walk or play session before leaving means a calmer, sleepier pet while you're gone.",
      "Puzzle toys: a Kong stuffed with frozen peanut butter can keep a dog engaged for 20–30 minutes.",
      "Avoid dramatic goodbyes: long emotional farewells increase anxiety — a quiet 'see you later' is enough.",
      "Severe cases: consult a certified behaviorist. Medication combined with training helps in serious situations.",
    ],
  },
  {
    icon: "🐱",
    title: "Cat Behavior",
    color: "#FFF3E0",
    accent: "#E65100",
    points: [
      "Slow blink = trust: a slow blink from a cat signals affection — try blinking back, many cats mirror it.",
      "Tail up = happy: held high means relaxed and friendly. A puffed tail means scared or agitated.",
      "Scratching is natural: cats scratch to stretch and mark territory — provide posts near their favorite spots.",
      "Litter box rules: one box per cat plus one extra. Scoop daily. Eliminating outside the box signals a problem.",
      "Redirect biting: never use hands as toys. Always redirect to wand toys and end play if biting occurs.",
    ],
  },
  {
    icon: "🚨",
    title: "Problem Behaviors",
    color: "#FFF3E0",
    accent: "#E65100",
    points: [
      "Jumping up: turn away and cross arms when they jump. Only give attention with all four paws on the ground.",
      "Excessive barking: identify the trigger — boredom, alerting, anxiety. Never yell; it sounds like barking back.",
      "Chewing: puppies chew from teething, adults from boredom. Provide chews and manage access to off-limit items.",
      "Aggression: never punish growling — it removes warning signs. Always consult a professional for aggressive behavior.",
      "Leash pulling: stop moving the moment they pull. Only move forward on a loose leash. Takes time but works.",
    ],
  },
  {
    icon: "⭐",
    title: "Positive Reinforcement",
    color: "#FFF3E0",
    accent: "#E65100",
    points: [
      "Timing matters: reward within 2 seconds of the desired behavior — anything later breaks the connection.",
      "High-value treats: for new skills use irresistible rewards like chicken, cheese, or hot dog pieces.",
      "Short sessions: 5–10 minutes is ideal, especially for puppies. Always end on a behavior they know well.",
      "Phase out treats gradually: once reliable, reward intermittently — random rewards maintain behavior better.",
      "Your voice is a reward: enthusiastic praise combined with treats is more powerful than treats alone.",
    ],
  },
];

export default function Training() {
  const [open, setOpen] = useState(null);

  return (
    <div style={{ fontFamily: "sans-serif", minHeight: "100vh", background: "#F8F8F5", paddingBottom: 80 }}>
      {/* Hero */}
      <div style={{ background: "#F97316", padding: "56px 40px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10, fontFamily: "monospace", position: "relative" }}>FureverHome</p>
        <h1 style={{ color: "#fff", fontSize: "clamp(26px, 5vw, 44px)", margin: "0 0 14px", fontFamily: "Georgia, serif", fontWeight: 700, position: "relative" }}>Training & Behavior</h1>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, maxWidth: 500, margin: "0 auto", lineHeight: 1.65, position: "relative" }}>
          Practical, science-backed guidance for raising a confident, well-behaved companion.
        </p>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 0", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {sections.map((sec, i) => (
          <div
            key={i}
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              background: "#fff", borderRadius: 14,
              border: `1.5px solid ${open === i ? sec.accent : "#eee"}`,
              overflow: "hidden", cursor: "pointer", transition: "all 0.2s",
              boxShadow: open === i ? `0 4px 20px ${sec.accent}22` : "0 2px 6px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ background: open === i ? sec.color : "#fff", padding: "18px 18px 14px", display: "flex", alignItems: "center", gap: 12, transition: "background 0.2s" }}>
              <span style={{ fontSize: 26 }}>{sec.icon}</span>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: open === i ? sec.accent : "#222", flex: 1 }}>{sec.title}</h3>
              <span style={{ fontSize: 16, color: sec.accent, display: "inline-block", transform: open === i ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
            </div>
            {open === i && (
              <ul style={{ margin: 0, padding: "12px 18px 16px", listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {sec.points.map((pt, j) => (
                  <li key={j} style={{ display: "flex", gap: 8, fontSize: 13, color: "#444", lineHeight: 1.6, alignItems: "flex-start" }}>
                    <span style={{ color: sec.accent, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>→</span>
                    {pt}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, Mail, Phone, MessageSquare, BookOpen, FileText, PawPrint, ExternalLink } from "lucide-react";

const faqs = [
  {
    id: 1,
    category: "Adoption Process",
    question: "How do I apply to adopt a pet?",
    answer: "Browse pets on the Explore Pets page, click on a pet you love, and hit the 'Apply to Adopt' button. Fill in the adoption form with your details and submit. The shelter will review your application and get back to you within 3–5 business days.",
  },
  {
    id: 2,
    category: "Adoption Process",
    question: "How long does the adoption process take?",
    answer: "The process typically takes 1–2 weeks. After submitting your application, the shelter reviews it, schedules a meet & greet, and finalizes the paperwork. Some shelters may take longer depending on their workload.",
  },
  {
    id: 3,
    category: "Adoption Process",
    question: "Can I adopt a pet if I live in an apartment?",
    answer: "Yes! Many pets are well-suited for apartment living. Cats, small dogs, and rabbits adapt well to smaller spaces. Each pet's profile mentions whether they are suitable for apartments. Make sure your building allows pets before applying.",
  },
  {
    id: 4,
    category: "Applications",
    question: "How do I check the status of my application?",
    answer: "Go to My Requests in the dashboard. You'll see all your applications with their current status — Pending, Under Review, Approved, or Rejected. You can also track the progress timeline for each application.",
  },
  {
    id: 5,
    category: "Applications",
    question: "Can I withdraw my adoption application?",
    answer: "Yes, you can withdraw a Pending or Under Review application at any time. Go to My Requests, expand the application card, and click 'Withdraw Application'. Approved applications cannot be withdrawn.",
  },
  {
    id: 6,
    category: "Applications",
    question: "Why was my application rejected?",
    answer: "Applications can be rejected for various reasons — the pet may have already been adopted, your living situation may not be suitable, or the shelter may have concerns. You can contact the shelter directly for more details and try again with another pet.",
  },
  {
    id: 7,
    category: "Account",
    question: "How do I update my profile information?",
    answer: "Go to Profile in the dashboard and click 'Edit Profile'. You can update your name, location, bio, and profile picture. Make sure to save your changes before leaving the page.",
  },
  {
    id: 8,
    category: "Account",
    question: "How do I save a pet to my wishlist?",
    answer: "On any pet card or pet detail page, click the heart icon to save it to your wishlist. You can view all saved pets in the Saved Pets section of your dashboard. Click the heart again or the X button to remove it.",
  },
];

const quickLinks = [
  { icon: PawPrint, label: "How Adoption Works", desc: "Step-by-step adoption guide", color: "#FFF0E6", textColor: "#E07B39" },
  { icon: FileText, label: "Adoption Requirements", desc: "What you need to qualify", color: "#E1F5EE", textColor: "#0F6E56" },
  { icon: BookOpen, label: "Pet Care Guides", desc: "Tips for new pet owners", color: "#E6F1FB", textColor: "#185FA5" },
  { icon: MessageSquare, label: "Shelter Directory", desc: "Find shelters near you", color: "#FBEAF0", textColor: "#993556" },
];

const CATEGORIES = ["All", "Adoption Process", "Applications", "Account"];

function FAQItem({ faq }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      background: "#fff", borderRadius: 14, border: "1px solid #F0EDE8",
      overflow: "hidden", transition: "box-shadow 0.2s",
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.05)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", background: "none", border: "none",
          padding: "18px 20px", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
          fontFamily: "inherit", textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: open ? "#E07B39" : "#E0DDD8", flexShrink: 0,
            transition: "background 0.2s",
          }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: "#1E1E1C", lineHeight: 1.4 }}>
            {faq.question}
          </span>
        </div>
        <div style={{
          width: 28, height: 28, borderRadius: 8, flexShrink: 0,
          background: open ? "#FFF0E6" : "#FAF8F5",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 0.2s",
        }}>
          {open
            ? <ChevronUp size={15} color="#E07B39" />
            : <ChevronDown size={15} color="#AAA" />
          }
        </div>
      </button>

      {open && (
        <div style={{
          padding: "0 20px 18px 40px",
          fontSize: 14, color: "#666", lineHeight: 1.75,
          borderTop: "1px solid #F9F7F4",
          paddingTop: 14,
        }}>
          {faq.answer}
        </div>
      )}
    </div>
  );
}

export default function Help() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const filtered = activeCategory === "All"
    ? faqs
    : faqs.filter(f => f.category === activeCategory);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      background: "#FAF8F5",
      minHeight: "100vh",
      padding: "2.5rem 2rem",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        input, textarea, select {
          font-family: inherit;
          font-size: 14px;
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #F0EDE8;
          border-radius: 10px;
          background: #FAF8F5;
          color: #1E1E1C;
          outline: none;
          transition: border 0.2s;
          resize: none;
        }
        input:focus, textarea:focus {
          border-color: #E07B39;
          background: #fff;
        }
        input::placeholder, textarea::placeholder { color: #CCC; }
      `}</style>

      <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>

        {/* Header */}
        <div>
          <h1 style={{
            fontFamily: "'Lora', serif", fontSize: 26, fontWeight: 700,
            color: "#1E1E1C", margin: "0 0 6px",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <HelpCircle size={24} color="#E07B39" />
            Help & Support
          </h1>
          <p style={{ fontSize: 14, color: "#999", margin: 0 }}>
            Find answers, guides and get in touch with our support team.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <div style={{
            fontSize: 12, fontWeight: 600, color: "#AAA",
            textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14,
          }}>
            Quick Links & Guides
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 12 }}>
            {quickLinks.map((link, i) => {
              const Icon = link.icon;
              return (
                <div key={i} style={{
                  background: "#fff", borderRadius: 14, border: "1px solid #F0EDE8",
                  padding: "18px 16px", cursor: "pointer",
                  display: "flex", alignItems: "flex-start", gap: 14,
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.07)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: link.color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon size={18} color={link.textColor} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1E1E1C", marginBottom: 3, display: "flex", alignItems: "center", gap: 4 }}>
                      {link.label}
                      <ExternalLink size={11} color="#CCC" />
                    </div>
                    <div style={{ fontSize: 12, color: "#AAA" }}>{link.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <div style={{
            fontSize: 12, fontWeight: 600, color: "#AAA",
            textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14,
          }}>
            Frequently Asked Questions
          </div>

          {/* Category filter */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "6px 14px", borderRadius: 20, fontSize: 12,
                  fontWeight: 500, fontFamily: "inherit", cursor: "pointer",
                  border: activeCategory === cat ? "1.5px solid #E07B39" : "1.5px solid #F0EDE8",
                  background: activeCategory === cat ? "#FFF0E6" : "#fff",
                  color: activeCategory === cat ? "#E07B39" : "#888",
                  transition: "all 0.2s",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.map(faq => (
              <FAQItem key={faq.id} faq={faq} />
            ))}
          </div>
        </div>

        {/* Contact Support Form */}
        <div>
          <div style={{
            fontSize: 12, fontWeight: 600, color: "#AAA",
            textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14,
          }}>
            Contact Support
          </div>

          <div style={{
            background: "#fff", borderRadius: 20, border: "1px solid #F0EDE8",
            padding: "28px 32px",
          }}>

            {/* Contact options */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, marginBottom: 28 }}>
              {[
                { icon: Mail, label: "Email Us", value: "support@fureverhome.np", color: "#FFF0E6", textColor: "#E07B39" },
                { icon: Phone, label: "Call Us", value: "+977 01-4XXXXXX", color: "#E1F5EE", textColor: "#0F6E56" },
                { icon: MessageSquare, label: "WhatsApp", value: "+977 98XXXXXXXX", color: "#E6F1FB", textColor: "#185FA5" },
              ].map((c, i) => {
                const Icon = c.icon;
                return (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    background: c.color, borderRadius: 12, padding: "14px 16px",
                  }}>
                    <Icon size={18} color={c.textColor} />
                    <div>
                      <div style={{ fontSize: 11, color: c.textColor, fontWeight: 600, marginBottom: 2 }}>{c.label}</div>
                      <div style={{ fontSize: 13, color: "#444", fontWeight: 500 }}>{c.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Success message */}
            {submitted && (
              <div style={{
                background: "#EAF3DE", border: "1px solid #C8EDD8",
                borderRadius: 12, padding: "14px 18px", marginBottom: 20,
                fontSize: 14, fontWeight: 500, color: "#3B6D11",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                ✅ Your message has been sent! We'll get back to you within 24 hours.
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#888", display: "block", marginBottom: 6 }}>
                    Your Name
                  </label>
                  <input
                    type="text" placeholder="Sadikshya Mainali" required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#888", display: "block", marginBottom: 6 }}>
                    Email Address
                  </label>
                  <input
                    type="email" placeholder="sadikshya@example.com" required
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#888", display: "block", marginBottom: 6 }}>
                  Subject
                </label>
                <input
                  type="text" placeholder="e.g. Issue with my adoption application" required
                  value={form.subject}
                  onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#888", display: "block", marginBottom: 6 }}>
                  Message
                </label>
                <textarea
                  rows={5} placeholder="Describe your issue or question in detail..." required
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                />
              </div>

              <button
                type="submit"
                style={{
                  background: "#E07B39", color: "#fff",
                  border: "none", borderRadius: 12,
                  padding: "12px 28px", fontSize: 14,
                  fontWeight: 600, fontFamily: "inherit",
                  cursor: "pointer", alignSelf: "flex-start",
                  transition: "background 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#C96A2A"}
                onMouseLeave={e => e.currentTarget.style.background = "#E07B39"}
              >
                Send Message →
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
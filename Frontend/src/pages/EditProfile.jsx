import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PawPrint, Camera, Eye, EyeOff, ArrowLeft, Check } from "lucide-react";


const initialData = {
  name: "Sadikshya Mainali",
  initials: "SM",
  location: "Kathmandu, Nepal",
  bio: "Lifelong animal lover, foster parent, and proud pet mom to three rescued companions. Passionate about giving every animal a forever home.",
  email: "sadikshya.main@example.com",
  phone: "+977 98XXXXXXXX",
};

export default function EditProfile() {
  const navigate = useNavigate();
  const fileRef = useRef();

  const [form, setForm] = useState(initialData);
  const [avatar, setAvatar] = useState(null);
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [showPass, setShowPass] = useState({ current: false, newPass: false, confirm: false });
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.location.trim()) errs.location = "Location is required.";
    if (passwords.newPass && passwords.newPass.length < 6)
      errs.newPass = "Password must be at least 6 characters.";
    if (passwords.newPass && passwords.newPass !== passwords.confirm)
      errs.confirm = "Passwords do not match.";
    if (passwords.newPass && !passwords.current)
      errs.current = "Enter your current password.";
    return errs;
  };

  const handleSave = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      navigate("/dashboard/profile");
    }, 1800);
  };

  const inputStyle = (hasError) => ({
    fontFamily: "inherit", fontSize: 14,
    width: "100%", padding: "10px 14px",
    border: `1px solid ${hasError ? "#E24B4A" : "#F0EDE8"}`,
    borderRadius: 10, background: "#FAF8F5",
    color: "#1E1E1C", outline: "none",
    transition: "border 0.2s",
  });

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      background: "#FAF8F5", minHeight: "100vh", padding: "2.5rem 2rem",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        input:focus, textarea:focus { border-color: #E07B39 !important; background: #fff !important; }
        input::placeholder, textarea::placeholder { color: #CCC; }
        textarea { resize: none; }
      `}</style>

      <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            onClick={() => navigate("/dashboard/profile")}
            style={{
              background: "#fff", border: "1px solid #F0EDE8",
              borderRadius: 10, width: 38, height: 38,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", flexShrink: 0,
              transition: "background 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#FFF0E6"}
            onMouseLeave={e => e.currentTarget.style.background = "#fff"}
          >
            <ArrowLeft size={16} color="#888" />
          </button>
          <div>
            <h1 style={{
              fontFamily: "'Lora', serif", fontSize: 22, fontWeight: 700,
              color: "#1E1E1C", margin: 0,
            }}>Edit Profile</h1>
            <p style={{ fontSize: 13, color: "#999", margin: 0 }}>Update your personal information</p>
          </div>
        </div>

        {/* Success banner */}
        {saved && (
          <div style={{
            background: "#EAF3DE", border: "1px solid #C8EDD8",
            borderRadius: 12, padding: "14px 18px",
            fontSize: 14, fontWeight: 500, color: "#3B6D11",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <Check size={16} /> Profile updated successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Avatar */}
          <div style={{
            background: "#fff", borderRadius: 20, border: "1px solid #F0EDE8",
            padding: "28px 32px", display: "flex", alignItems: "center", gap: 24,
          }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              {avatar ? (
                <img src={avatar} alt="avatar" style={{
                  width: 88, height: 88, borderRadius: "50%",
                  objectFit: "cover", border: "3px solid #FFD9BB",
                }} />
              ) : (
                <div style={{
                  width: 88, height: 88, borderRadius: "50%",
                  background: "linear-gradient(145deg, #FFBE8A, #E07B39)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Lora', serif", fontSize: 28, fontWeight: 700, color: "#fff",
                }}>
                  {form.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileRef.current.click()}
                style={{
                  position: "absolute", bottom: 2, right: 2,
                  width: 28, height: 28, borderRadius: "50%",
                  background: "#E07B39", border: "2px solid #FAF8F5",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <Camera size={13} color="#fff" />
              </button>
              <input ref={fileRef} type="file" accept="image/*"
                style={{ display: "none" }} onChange={handleAvatarChange} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1E1E1C", marginBottom: 4 }}>
                Profile Photo
              </div>
              <div style={{ fontSize: 13, color: "#999", marginBottom: 12 }}>
                JPG or PNG. Max size 2MB.
              </div>
              <button
                type="button"
                onClick={() => fileRef.current.click()}
                style={{
                  background: "#FFF0E6", border: "1px solid #FFD9BB",
                  borderRadius: 10, padding: "7px 16px",
                  fontSize: 13, fontWeight: 600, color: "#E07B39",
                  cursor: "pointer", fontFamily: "inherit",
                  transition: "background 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#FFE4CC"}
                onMouseLeave={e => e.currentTarget.style.background = "#FFF0E6"}
              >
                Upload Photo
              </button>
            </div>
          </div>

          {/* Personal Info */}
          <div style={{
            background: "#fff", borderRadius: 20, border: "1px solid #F0EDE8",
            padding: "28px 32px", display: "flex", flexDirection: "column", gap: 18,
          }}>
            <div style={{
              fontSize: 12, fontWeight: 600, color: "#AAA",
              textTransform: "uppercase", letterSpacing: "0.06em",
            }}>Personal Information</div>

            {/* Name */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#888", display: "block", marginBottom: 6 }}>
                Full Name
              </label>
              <input
                type="text" placeholder="Sarah Miller"
                value={form.name}
                style={inputStyle(errors.name)}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
              {errors.name && <p style={{ fontSize: 12, color: "#E24B4A", margin: "4px 0 0" }}>{errors.name}</p>}
            </div>

            {/* Location */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#888", display: "block", marginBottom: 6 }}>
                Location
              </label>
              <input
                type="text" placeholder="Kathmandu, Nepal"
                value={form.location}
                style={inputStyle(errors.location)}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              />
              {errors.location && <p style={{ fontSize: 12, color: "#E24B4A", margin: "4px 0 0" }}>{errors.location}</p>}
            </div>

            {/* Email + Phone */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#888", display: "block", marginBottom: 6 }}>
                  Email Address
                </label>
                <input
                  type="email" placeholder="sarah@example.com"
                  value={form.email}
                  style={inputStyle(false)}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#888", display: "block", marginBottom: 6 }}>
                  Phone Number
                </label>
                <input
                  type="tel" placeholder="+977 98XXXXXXXX"
                  value={form.phone}
                  style={inputStyle(false)}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#888", display: "block", marginBottom: 6 }}>
                Bio
              </label>
              <textarea
                rows={4} placeholder="Tell shelters a little about yourself..."
                value={form.bio}
                style={inputStyle(false)}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              />
              <p style={{ fontSize: 11, color: "#CCC", margin: "4px 0 0", textAlign: "right" }}>
                {form.bio.length} / 300
              </p>
            </div>
          </div>

          {/* Change Password */}
          <div style={{
            background: "#fff", borderRadius: 20, border: "1px solid #F0EDE8",
            padding: "28px 32px", display: "flex", flexDirection: "column", gap: 18,
          }}>
            <div>
              <div style={{
                fontSize: 12, fontWeight: 600, color: "#AAA",
                textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4,
              }}>Change Password</div>
              <p style={{ fontSize: 13, color: "#BBB", margin: 0 }}>Leave blank if you don't want to change it.</p>
            </div>

            {[
              { key: "current", label: "Current Password", placeholder: "Enter current password" },
              { key: "newPass", label: "New Password", placeholder: "At least 6 characters" },
              { key: "confirm", label: "Confirm New Password", placeholder: "Repeat new password" },
            ].map(field => (
              <div key={field.key}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#888", display: "block", marginBottom: 6 }}>
                  {field.label}
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPass[field.key] ? "text" : "password"}
                    placeholder={field.placeholder}
                    value={passwords[field.key]}
                    style={{ ...inputStyle(errors[field.key]), paddingRight: 42 }}
                    onChange={e => setPasswords(p => ({ ...p, [field.key]: e.target.value }))}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(s => ({ ...s, [field.key]: !s[field.key] }))}
                    style={{
                      position: "absolute", right: 12, top: "50%",
                      transform: "translateY(-50%)", background: "none",
                      border: "none", cursor: "pointer", padding: 0,
                      display: "flex", alignItems: "center",
                    }}
                  >
                    {showPass[field.key]
                      ? <EyeOff size={16} color="#BBB" />
                      : <Eye size={16} color="#BBB" />
                    }
                  </button>
                </div>
                {errors[field.key] && (
                  <p style={{ fontSize: 12, color: "#E24B4A", margin: "4px 0 0" }}>{errors[field.key]}</p>
                )}
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => navigate("/dashboard/profile")}
              style={{
                background: "#fff", border: "1px solid #F0EDE8",
                borderRadius: 12, padding: "11px 24px",
                fontSize: 14, fontWeight: 600, color: "#888",
                cursor: "pointer", fontFamily: "inherit",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#FAF8F5"}
              onMouseLeave={e => e.currentTarget.style.background = "#fff"}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                background: "#E07B39", border: "none",
                borderRadius: 12, padding: "11px 28px",
                fontSize: 14, fontWeight: 600, color: "#fff",
                cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: 8,
                transition: "background 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#C96A2A"}
              onMouseLeave={e => e.currentTarget.style.background = "#E07B39"}
            >
              <PawPrint size={15} />
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
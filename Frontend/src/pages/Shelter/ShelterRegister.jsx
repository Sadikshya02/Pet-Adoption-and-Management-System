import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Upload, X, FileText, MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).href,
  iconUrl:       new URL("leaflet/dist/images/marker-icon.png",    import.meta.url).href,
  shadowUrl:     new URL("leaflet/dist/images/marker-shadow.png",  import.meta.url).href,
});

const PROVINCES = [
  "Koshi", "Madhesh", "Bagmati", "Gandaki",
  "Lumbini", "Karnali", "Sudurpashchim",
];

const ANIMAL_TYPES = ["Dog", "Cat", "Rabbit", "Bird", "Other"];

const DOCUMENT_TYPES = [
  { key: "registrationCertificate", label: "Registration Certificate *", required: true },
  { key: "taxDocument",             label: "Tax/PAN Document",           required: false },
  { key: "ownerIdProof",            label: "Owner/Contact ID Proof",     required: false },
];

const LocationPicker = ({ onPick }) => {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

export default function ShelterRegister() {
  const navigate = useNavigate();
  const [loading, setLoading]     = useState(false);
  const [step, setStep]           = useState(1);
  const [documents, setDocuments] = useState({
    registrationCertificate: null,
    taxDocument:              null,
    ownerIdProof:             null,
  });

  const [form, setForm] = useState({
    organizationName:   "",
    registrationNumber: "",
    contactPerson:      "",
    email:              "",
    phone:              "",
    password:           "",
    confirmPassword:    "",
    district:           "",
    province:           "",
    fullAddress:        "",
    website:            "",
    socialLinks: { facebook: "", instagram: "", twitter: "" },
    description:  "",
    capacity:     "",
    animalTypes:  [],
    location:     { lat: "", lng: "" },
  });

  const handle = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("social.")) {
      const key = name.split(".")[1];
      setForm(f => ({ ...f, socialLinks: { ...f.socialLinks, [key]: value } }));
    } else if (name.startsWith("location.")) {
      const key = name.split(".")[1];
      setForm(f => ({ ...f, location: { ...f.location, [key]: value } }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleMapPick = (lat, lng) => {
    setForm(f => ({
      ...f,
      location: {
        lat: parseFloat(lat.toFixed(6)),
        lng: parseFloat(lng.toFixed(6)),
      },
    }));
  };

  const toggleAnimal = (type) => {
    setForm(f => ({
      ...f,
      animalTypes: f.animalTypes.includes(type)
        ? f.animalTypes.filter(t => t !== type)
        : [...f.animalTypes, type],
    }));
  };

  const handleDocumentChange = (key, file) => {
    setDocuments(d => ({ ...d, [key]: file }));
  };

  const removeDocument = (key) => {
    setDocuments(d => ({ ...d, [key]: null }));
  };

  // ── Step validators ───────────────────────────────────────────────────────
  const validateStep1 = () => {
    if (!form.organizationName || !form.registrationNumber ||
        !form.contactPerson || !form.email ||
        !form.phone || !form.password) {
      toast.error("Please fill all required fields"); return false;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match"); return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!form.province || !form.district || !form.fullAddress) {
      toast.error("Please fill required location fields"); return false;
    }
    if (!form.location.lat || !form.location.lng) {
      toast.error("Please pin your shelter location on the map"); return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!form.description) {
      toast.error("Please add a shelter description"); return false;
    }
    if (form.animalTypes.length === 0) {
      toast.error("Select at least one animal type"); return false;
    }
    return true;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!documents.registrationCertificate) {
      toast.error("Registration certificate is required"); return;
    }
    if (!form.location.lat || !form.location.lng) {
      toast.error("Please pin your shelter location on the map"); return;
    }

    try {
      setLoading(true);

      const { confirmPassword, ...payload } = form;

      // ✅ ensure location is sent as proper numbers
      payload.location = {
        lat: parseFloat(form.location.lat),
        lng: parseFloat(form.location.lng),
      };

      const registerRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/shelter-auth/register`,
        payload
      );

      // ✅ backend returns shelter._id and token
      const shelterId = registerRes.data.shelter._id;
      const token     = registerRes.data.token;

      // upload documents if any
      const fd = new FormData();
      Object.entries(documents).forEach(([key, file]) => {
        if (file) fd.append(key, file);
      });

      await axios.post(
        `${import.meta.env.VITE_API_URL}/shelter-auth/upload-documents/${shelterId}`,
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Registration submitted! Await admin approval.");
      navigate("/shelter/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50";
  const labelCls = "block text-sm font-semibold text-gray-700 mb-1";

  const mapCenter = form.location.lat
    ? [parseFloat(form.location.lat), parseFloat(form.location.lng)]
    : [28.3949, 84.124];

  return (
    <div className="min-h-screen bg-orange-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Register Your Shelter</h1>
          <p className="text-gray-500 mt-2">Join FureverHome and help pets find loving families</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step >= s ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-400"
              }`}>{s}</div>
              {s < 4 && (
                <div className={`w-12 h-1 rounded ${step > s ? "bg-orange-500" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">

          {/* ── Step 1: Organization Details ───────────────────────────── */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Organization Details</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Organization Name *</label>
                  <input name="organizationName" value={form.organizationName} onChange={handle}
                    className={inputCls} placeholder="Happy Paws Rescue" />
                </div>
                <div>
                  <label className={labelCls}>Registration Number *</label>
                  <input name="registrationNumber" value={form.registrationNumber} onChange={handle}
                    className={inputCls} placeholder="REG-12345" />
                </div>
              </div>

              <div>
                <label className={labelCls}>Contact Person *</label>
                <input name="contactPerson" value={form.contactPerson} onChange={handle}
                  className={inputCls} placeholder="Full name of contact person" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handle}
                    className={inputCls} placeholder="shelter@email.com" />
                </div>
                <div>
                  <label className={labelCls}>Phone *</label>
                  <input name="phone" value={form.phone} onChange={handle}
                    className={inputCls} placeholder="98XXXXXXXX" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Password *</label>
                  <input name="password" type="password" value={form.password} onChange={handle}
                    className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Confirm Password *</label>
                  <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handle}
                    className={inputCls} />
                </div>
              </div>

              <button
                type="button"
                onClick={() => validateStep1() && setStep(2)}
                className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition mt-4"
              >
                Next →
              </button>
            </div>
          )}

          {/* ── Step 2: Location ───────────────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Location & Address</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Province *</label>
                  <select name="province" value={form.province} onChange={handle} className={inputCls}>
                    <option value="">Select Province</option>
                    {PROVINCES.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>District *</label>
                  <input name="district" value={form.district} onChange={handle}
                    className={inputCls} placeholder="Kathmandu" />
                </div>
              </div>

              <div>
                <label className={labelCls}>Full Address *</label>
                <input name="fullAddress" value={form.fullAddress} onChange={handle}
                  className={inputCls} placeholder="Street, Ward, Municipality" />
              </div>

              {/* Map Picker */}
              <div>
                <label className={labelCls}>
                  <MapPin size={14} className="inline mr-1 text-orange-500" />
                  Pin Your Shelter Location *
                </label>
                <p className="text-xs text-gray-400 mb-2">
                  Click anywhere on the map to drop a pin on your shelter's exact location
                </p>

                <div className="rounded-2xl overflow-hidden border-2 border-orange-200" style={{ height: 300 }}>
                  <MapContainer
                    center={mapCenter}
                    zoom={form.location.lat ? 14 : 7}
                    style={{ height: "100%", width: "100%" }}
                    zoomControl={true}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationPicker onPick={handleMapPick} />
                    {form.location.lat && form.location.lng && (
                      <Marker position={[
                        parseFloat(form.location.lat),
                        parseFloat(form.location.lng),
                      ]} />
                    )}
                  </MapContainer>
                </div>

                {/* Coordinate display */}
                {form.location.lat ? (
                  <div className="mt-2 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2">
                    <MapPin size={14} className="text-green-600 flex-shrink-0" />
                    <span className="text-sm text-green-700 font-medium">
                      📍 {form.location.lat}, {form.location.lng}
                    </span>
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, location: { lat: "", lng: "" } }))}
                      className="ml-auto text-red-400 hover:text-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="mt-2 bg-orange-50 border border-orange-100 rounded-xl px-4 py-2 text-sm text-orange-600">
                    👆 Click on the map to pin your location
                  </div>
                )}

                {/* Manual fallback */}
                <details className="mt-2">
                  <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
                    Enter coordinates manually instead
                  </summary>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div>
                      <label className={labelCls}>Latitude</label>
                      <input name="location.lat" type="number" value={form.location.lat} onChange={handle}
                        className={inputCls} placeholder="27.7172" />
                    </div>
                    <div>
                      <label className={labelCls}>Longitude</label>
                      <input name="location.lng" type="number" value={form.location.lng} onChange={handle}
                        className={inputCls} placeholder="85.3240" />
                    </div>
                  </div>
                </details>
              </div>

              <div>
                <label className={labelCls}>Website</label>
                <input name="website" value={form.website} onChange={handle}
                  className={inputCls} placeholder="https://yourshelter.com" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>Facebook</label>
                  <input name="social.facebook" value={form.socialLinks.facebook} onChange={handle}
                    className={inputCls} placeholder="facebook.com/..." />
                </div>
                <div>
                  <label className={labelCls}>Instagram</label>
                  <input name="social.instagram" value={form.socialLinks.instagram} onChange={handle}
                    className={inputCls} placeholder="instagram.com/..." />
                </div>
                <div>
                  <label className={labelCls}>Twitter</label>
                  <input name="social.twitter" value={form.socialLinks.twitter} onChange={handle}
                    className={inputCls} placeholder="twitter.com/..." />
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setStep(1)}
                  className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition">
                  ← Back
                </button>
                <button type="button" onClick={() => validateStep2() && setStep(3)}
                  className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition">
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Shelter Details ────────────────────────────────── */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Shelter Details</h2>

              <div>
                <label className={labelCls}>Shelter Description *</label>
                <textarea name="description" value={form.description} onChange={handle}
                  className={inputCls} rows={4}
                  placeholder="Tell us about your shelter, your mission, and how long you've been operating..." />
              </div>

              <div>
                <label className={labelCls}>Capacity (number of animals)</label>
                <input name="capacity" type="number" value={form.capacity} onChange={handle}
                  className={inputCls} placeholder="50" />
              </div>

              <div>
                <label className={labelCls}>Animals You Support *</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {ANIMAL_TYPES.map(type => (
                    <button key={type} type="button" onClick={() => toggleAnimal(type)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                        form.animalTypes.includes(type)
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
                      }`}>
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setStep(2)}
                  className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition">
                  ← Back
                </button>
                <button type="button" onClick={() => validateStep3() && setStep(4)}
                  className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition">
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* ── Step 4: Documents ──────────────────────────────────────── */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Verification Documents</h2>
              <p className="text-sm text-gray-500 mb-6">
                Upload documents to verify your shelter. Accepted formats: PDF, JPG, PNG (max 5MB each).
              </p>

              {DOCUMENT_TYPES.map(({ key, label, required }) => (
                <div key={key}>
                  <label className={labelCls}>{label}</label>
                  {documents[key] ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-3">
                        <FileText size={18} className="text-green-600 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-green-800 truncate max-w-xs">
                            {documents[key].name}
                          </p>
                          <p className="text-xs text-green-600">
                            {(documents[key].size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <button type="button" onClick={() => removeDocument(key)}
                        className="text-red-400 hover:text-red-600 transition">
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center gap-3 border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-orange-300 hover:bg-orange-50 transition">
                      <Upload size={18} className="text-orange-400 flex-shrink-0" />
                      <span className="text-sm text-gray-500">
                        Click to upload {label.replace(" *", "")}
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file && file.size > 5 * 1024 * 1024) {
                            toast.error("File must be under 5MB"); return;
                          }
                          if (file) handleDocumentChange(key, file);
                        }}
                      />
                    </label>
                  )}
                </div>
              ))}

              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-sm text-orange-800">
                ⏳ After submitting, your registration will be reviewed by our admin team. You'll be able to log in once approved.
              </div>

              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setStep(3)}
                  className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition">
                  ← Back
                </button>
                <button type="button" onClick={handleSubmit} disabled={loading}
                  className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition disabled:opacity-60">
                  {loading ? "Submitting..." : "Submit Registration"}
                </button>
              </div>
            </div>
          )}

        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Already approved?{" "}
          <Link to="/shelter/login" className="text-orange-500 font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
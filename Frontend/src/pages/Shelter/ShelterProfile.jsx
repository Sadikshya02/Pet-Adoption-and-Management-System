import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const PROVINCES = ["Koshi","Madhesh","Bagmati","Gandaki","Lumbini","Karnali","Sudurpashchim"];

export default function ShelterProfile() {
  const [form, setForm]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [logo, setLogo]       = useState(null);

  useEffect(() => {
    axios.get("http://localhost:4000/api/shelters/profile", { withCredentials: true })
      .then(r => { setForm(r.data.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

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

  const handleSave = async () => {
    try {
      setSaving(true);
      if (logo) {
        const fd = new FormData();
        fd.append("logo", logo);
        const r = await axios.post("http://localhost:4000/api/shelters/upload-logo", fd, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        setForm(f => ({ ...f, logo: r.data.url }));
        const stored = JSON.parse(localStorage.getItem("shelter") || "{}");
        localStorage.setItem("shelter", JSON.stringify({ ...stored, logo: r.data.url }));
      }
      await axios.put("http://localhost:4000/api/shelters/profile", form, { withCredentials: true });
      toast.success("Profile updated!");
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50";
  const labelCls = "block text-sm font-semibold text-gray-700 mb-1";

  if (loading) return <div className="animate-pulse bg-gray-200 rounded-2xl h-96" />;
  if (!form)   return <div className="text-gray-400 text-center py-20">Failed to load profile</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Shelter Profile</h1>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">

        {/* Logo */}
        <div className="flex items-center gap-4">
          {form.logo ? (
            <img src={form.logo} className="w-16 h-16 rounded-2xl object-cover border border-gray-100" alt="logo" />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center text-3xl">🏠</div>
          )}
          <div>
            <label className={labelCls}>Update Logo</label>
            <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files[0])}
              className="text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:bg-orange-50 file:text-orange-600 file:font-semibold cursor-pointer" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelCls}>Organization Name</label><input name="organizationName" value={form.organizationName || ""} onChange={handle} className={inputCls} /></div>
          <div><label className={labelCls}>Contact Person</label><input name="contactPerson" value={form.contactPerson || ""} onChange={handle} className={inputCls} /></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelCls}>Phone</label><input name="phone" value={form.phone || ""} onChange={handle} className={inputCls} /></div>
          <div><label className={labelCls}>Website</label><input name="website" value={form.website || ""} onChange={handle} className={inputCls} /></div>
        </div>

        <div><label className={labelCls}>Full Address</label><input name="fullAddress" value={form.fullAddress || ""} onChange={handle} className={inputCls} /></div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Province</label>
            <select name="province" value={form.province || ""} onChange={handle} className={inputCls}>
              {PROVINCES.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div><label className={labelCls}>District</label><input name="district" value={form.district || ""} onChange={handle} className={inputCls} /></div>
        </div>

        <div><label className={labelCls}>Description</label><textarea name="description" value={form.description || ""} onChange={handle} className={inputCls} rows={3} /></div>

        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelCls}>Capacity</label><input name="capacity" type="number" value={form.capacity || ""} onChange={handle} className={inputCls} /></div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div><label className={labelCls}>Facebook</label><input name="social.facebook" value={form.socialLinks?.facebook || ""} onChange={handle} className={inputCls} /></div>
          <div><label className={labelCls}>Instagram</label><input name="social.instagram" value={form.socialLinks?.instagram || ""} onChange={handle} className={inputCls} /></div>
          <div><label className={labelCls}>Twitter</label><input name="social.twitter" value={form.socialLinks?.twitter || ""} onChange={handle} className={inputCls} /></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelCls}>Latitude</label><input name="location.lat" type="number" value={form.location?.lat || ""} onChange={handle} className={inputCls} /></div>
          <div><label className={labelCls}>Longitude</label><input name="location.lng" type="number" value={form.location?.lng || ""} onChange={handle} className={inputCls} /></div>
        </div>

        <button onClick={handleSave} disabled={saving}
          className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition disabled:opacity-60">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
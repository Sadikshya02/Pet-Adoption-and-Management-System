import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Plus, X } from "lucide-react";

const EMPTY = {
  title: "", short_summary: "", full_content: "", category: "Grooming",
  pet_type: "Dog", difficulty_level: "Beginner", tags: "",
  publish_status: "Published", isFeatured: false, author_information: "",
};

const CATEGORIES = [
  "Grooming","Feeding and Nutrition","Vaccination","Health and Illness",
  "Training and Behavior","Puppy Care","Kitten Care","Senior Pet Care",
  "Rescue and Rehabilitation","Adoption Preparation","Travel With Pets","Emergency or First Aid",
];

export default function ShelterTips() {
  const [tips, setTips]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);

  const fetchTips = async () => {
    try {
      const r = await axios.get("http://localhost:4000/api/pet-tips");
      setTips(r.data.data);
    } catch { toast.error("Failed to load tips"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTips(); }, []);

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const shelter = JSON.parse(localStorage.getItem("shelter") || "{}");
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(",").map(t => t.trim()) : [],
        author_information: shelter.organizationName || form.author_information,
      };
      await axios.post("http://localhost:4000/api/pet-tips", payload);
      toast.success("Tip published!");
      setModal(false);
      setForm(EMPTY);
      fetchTips();
    } catch { toast.error("Failed to publish tip"); }
    finally { setSaving(false); }
  };

  const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50";
  const labelCls = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Care Tips</h1>
        <button onClick={() => setModal(true)} className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition text-sm">
          <Plus size={16} /> Publish Tip
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="animate-pulse bg-gray-200 rounded-2xl h-32" />)}
        </div>
      ) : tips.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="text-5xl mb-3">📝</div>
          <p className="text-gray-500 font-medium">No tips published yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tips.map(tip => (
            <div key={tip._id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">{tip.category}</span>
              <h3 className="font-bold text-gray-900 mt-2 mb-1">{tip.title}</h3>
              <p className="text-xs text-gray-500 line-clamp-2">{tip.short_summary}</p>
              <div className="flex items-center gap-2 mt-3">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tip.publish_status === "Published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {tip.publish_status}
                </span>
                <span className="text-xs text-gray-400">{tip.pet_type}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold text-gray-900">Publish New Tip</h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
            </div>

            <div className="space-y-4">
              <div><label className={labelCls}>Title *</label><input name="title" value={form.title} onChange={handle} className={inputCls} /></div>
              <div><label className={labelCls}>Short Summary *</label><textarea name="short_summary" value={form.short_summary} onChange={handle} className={inputCls} rows={2} /></div>
              <div><label className={labelCls}>Full Content *</label><textarea name="full_content" value={form.full_content} onChange={handle} className={inputCls} rows={5} /></div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>Category</label>
                  <select name="category" value={form.category} onChange={handle} className={inputCls}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Pet Type</label>
                  <select name="pet_type" value={form.pet_type} onChange={handle} className={inputCls}>
                    {["Dog","Cat","All","Rabbit","Bird"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Difficulty</label>
                  <select name="difficulty_level" value={form.difficulty_level} onChange={handle} className={inputCls}>
                    {["Beginner","Intermediate","Advanced"].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div><label className={labelCls}>Tags (comma separated)</label><input name="tags" value={form.tags} onChange={handle} className={inputCls} placeholder="grooming, dogs, health" /></div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Publish Status</label>
                  <select name="publish_status" value={form.publish_status} onChange={handle} className={inputCls}>
                    <option>Published</option><option>Draft</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 mt-5">
                  <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handle} className="w-4 h-4 accent-orange-500" id="featured" />
                  <label htmlFor="featured" className="text-sm font-semibold text-gray-700 cursor-pointer">Mark as Featured</label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setModal(false)} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition disabled:opacity-60">
                  {saving ? "Publishing..." : "Publish Tip"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
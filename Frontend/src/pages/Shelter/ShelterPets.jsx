import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, X, Upload } from "lucide-react";

const EMPTY_PET = {
  name: "", breed: "", species: "Dog", age: "", gender: "Male",
  color: "", size: "Medium", description: "", profileStory: "",
  adoptionFee: 0, adoptionStatus: "Available", vaccinationStatus: "Unknown",
  isNeuteredOrSpayed: false, isMicrochipped: false, isHouseTrained: false,
  specialNeeds: false, specialNeedsDescription: "", medicalNotes: "",
  temperament: "", energyLevel: "Moderate",
  compatibleWithChildren: "Unknown", compatibleWithDogs: "Unknown", compatibleWithCats: "Unknown",
};

export default function ShelterPets() {
  const [pets, setPets]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(EMPTY_PET);
  const [photos, setPhotos]   = useState([]);
  const [saving, setSaving]   = useState(false);

  const fetchPets = async () => {
    try {
      const r = await axios.get("http://localhost:4000/api/shelters/pets", { withCredentials: true });
      setPets(r.data.data);
    } catch { toast.error("Failed to load pets"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPets(); }, []);

  const openAdd  = () => { setEditing(null); setForm(EMPTY_PET); setPhotos([]); setModal(true); };
  const openEdit = (pet) => {
    setEditing(pet._id);
    setForm({
      ...EMPTY_PET, ...pet,
      temperament: pet.temperament?.join(", ") || "",
    });
    setModal(true);
  };

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        ...form,
        temperament: form.temperament ? form.temperament.split(",").map(t => t.trim()) : [],
      };

      let savedPet;
      if (editing) {
        const r = await axios.put(`http://localhost:4000/api/shelters/pets/${editing}`, payload, { withCredentials: true });
        savedPet = r.data.data;
        toast.success("Pet updated!");
      } else {
        const r = await axios.post("http://localhost:4000/api/shelters/pets", payload, { withCredentials: true });
        savedPet = r.data.data;
        toast.success("Pet added!");
      }

      // Upload photos if any
      if (photos.length > 0) {
        const fd = new FormData();
        photos.forEach(p => fd.append("photos", p));
        await axios.post(`http://localhost:4000/api/shelters/pets/${savedPet._id}/photos`, fd, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setModal(false);
      fetchPets();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save pet");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this pet?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/shelters/pets/${id}`, { withCredentials: true });
      toast.success("Pet deleted");
      fetchPets();
    } catch { toast.error("Failed to delete"); }
  };

  const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50";
  const labelCls = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">My Pets</h1>
        <button onClick={openAdd} className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition text-sm">
          <Plus size={16} /> Add Pet
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="animate-pulse bg-gray-200 rounded-2xl h-48" />)}
        </div>
      ) : pets.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="text-5xl mb-4">🐾</div>
          <p className="text-gray-500 font-medium">No pets added yet.</p>
          <button onClick={openAdd} className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-orange-600 transition text-sm">
            Add your first pet
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pets.map(pet => (
            <div key={pet._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition">
              {pet.photos?.[0]?.url || pet.imageUrl ? (
                <img src={pet.photos?.[0]?.url || pet.imageUrl} alt={pet.name} className="h-40 w-full object-cover" />
              ) : (
                <div className="h-40 bg-orange-50 flex items-center justify-center text-5xl">{pet.emoji || "🐾"}</div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">{pet.name}</h3>
                    <p className="text-xs text-gray-500">{pet.breed} · {pet.age} · {pet.gender}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    pet.adoptionStatus === "Available" ? "bg-green-100 text-green-700" :
                    pet.adoptionStatus === "Adopted"   ? "bg-blue-100 text-blue-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>{pet.adoptionStatus}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => openEdit(pet)} className="flex items-center gap-1 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition">
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={() => handleDelete(pet._id)} className="flex items-center gap-1 text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add/Edit Modal ── */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold text-gray-900">{editing ? "Edit Pet" : "Add New Pet"}</h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Name *</label><input name="name" value={form.name} onChange={handle} className={inputCls} /></div>
                <div><label className={labelCls}>Breed *</label><input name="breed" value={form.breed} onChange={handle} className={inputCls} /></div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>Species</label>
                  <select name="species" value={form.species} onChange={handle} className={inputCls}>
                    {["Dog","Cat","Rabbit","Bird","Other"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Gender</label>
                  <select name="gender" value={form.gender} onChange={handle} className={inputCls}>
                    <option>Male</option><option>Female</option>
                  </select>
                </div>
                <div><label className={labelCls}>Age</label><input name="age" value={form.age} onChange={handle} className={inputCls} placeholder="2 years" /></div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>Size</label>
                  <select name="size" value={form.size} onChange={handle} className={inputCls}>
                    {["Tiny","Small","Medium","Large","Extra Large"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div><label className={labelCls}>Color</label><input name="color" value={form.color} onChange={handle} className={inputCls} /></div>
                <div>
                  <label className={labelCls}>Adoption Fee ($)</label>
                  <input name="adoptionFee" type="number" value={form.adoptionFee} onChange={handle} className={inputCls} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Adoption Status</label>
                  <select name="adoptionStatus" value={form.adoptionStatus} onChange={handle} className={inputCls}>
                    {["Available","Reserved","Adopted","Medical Hold"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Vaccination Status</label>
                  <select name="vaccinationStatus" value={form.vaccinationStatus} onChange={handle} className={inputCls}>
                    {["Unknown","Up to Date","Partially Vaccinated","Not Vaccinated"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelCls}>Description</label>
                <textarea name="description" value={form.description} onChange={handle} className={inputCls} rows={2} />
              </div>

              <div>
                <label className={labelCls}>Profile Story</label>
                <textarea name="profileStory" value={form.profileStory} onChange={handle} className={inputCls} rows={3} />
              </div>

              <div>
                <label className={labelCls}>Temperament (comma separated)</label>
                <input name="temperament" value={form.temperament} onChange={handle} className={inputCls} placeholder="Playful, Gentle, Calm" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>With Children</label>
                  <select name="compatibleWithChildren" value={form.compatibleWithChildren} onChange={handle} className={inputCls}>
                    {["Unknown","Yes","No","Older Children Only"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>With Dogs</label>
                  <select name="compatibleWithDogs" value={form.compatibleWithDogs} onChange={handle} className={inputCls}>
                    {["Unknown","Yes","No","With Introduction"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>With Cats</label>
                  <select name="compatibleWithCats" value={form.compatibleWithCats} onChange={handle} className={inputCls}>
                    {["Unknown","Yes","No","With Introduction"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                {[
                  { name: "isNeuteredOrSpayed", label: "Neutered/Spayed" },
                  { name: "isMicrochipped",     label: "Microchipped"    },
                  { name: "isHouseTrained",     label: "House Trained"   },
                  { name: "specialNeeds",        label: "Special Needs"   },
                ].map(cb => (
                  <label key={cb.name} className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
                    <input type="checkbox" name={cb.name} checked={form[cb.name]} onChange={handle} className="w-4 h-4 accent-orange-500" />
                    {cb.label}
                  </label>
                ))}
              </div>

              {form.specialNeeds && (
                <div>
                  <label className={labelCls}>Special Needs Description</label>
                  <input name="specialNeedsDescription" value={form.specialNeedsDescription} onChange={handle} className={inputCls} />
                </div>
              )}

              <div>
                <label className={labelCls}>Medical Notes</label>
                <textarea name="medicalNotes" value={form.medicalNotes} onChange={handle} className={inputCls} rows={2} />
              </div>

              {/* Photo Upload */}
              <div>
                <label className={labelCls}>Upload Photos</label>
                <label className="flex items-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-orange-300 transition text-sm text-gray-500">
                  <Upload size={16} className="text-orange-400" />
                  {photos.length > 0 ? `${photos.length} file(s) selected` : "Click to upload photos"}
                  <input type="file" multiple accept="image/*" className="hidden"
                    onChange={(e) => setPhotos(Array.from(e.target.files))} />
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setModal(false)} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition disabled:opacity-60">
                  {saving ? "Saving..." : editing ? "Update Pet" : "Add Pet"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
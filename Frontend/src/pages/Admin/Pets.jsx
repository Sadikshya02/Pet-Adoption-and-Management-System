import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "../../api";

const STATUS_BADGE = {
  available: <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full text-xs font-semibold">Available</span>,
  adopted:   <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-semibold">Adopted</span>,
  review:    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-semibold">Under Review</span>,
};

const EMPTY = {
  name: "", breed: "", species: "Dog", age: "", gender: "Male",
  status: "available", description: "", imageUrl: "",
};

export default function Pets() {
  const [pets, setPets]       = useState([]);
  const [filter, setFilter]   = useState("All");
  const [search, setSearch]   = useState("");
  const [modal, setModal]     = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPets() {
      try {
        const res = await axios.get("/pets");
        setPets(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load pets");
      } finally {
        setLoading(false);
      }
    }
    fetchPets();
  }, []);

  const filtered = pets.filter(
    (p) =>
      (filter === "All" || p.species === filter) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.breed.toLowerCase().includes(search.toLowerCase()))
  );

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (p) => { setEditing(p._id); setForm({ ...p, imageUrl: p.imageUrl || "" }); setModal(true); };

  const save = async () => {
    if (!form.name || !form.breed) { toast.error("Name and breed are required"); return; }
    try {
      if (editing) {
        const res = await axios.put(`/pets/${editing}`, form);
        setPets(prev => prev.map(p => p._id === editing ? res.data : p));
        toast.success("Pet updated!");
      } else {
        const res = await axios.post("/pets", form);
        setPets(prev => [res.data, ...prev]);
        toast.success("Pet added!");
      }
      setModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save pet");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this pet listing?")) return;
    try {
      await axios.delete(`/pets/${id}`);
      setPets(prev => prev.filter(p => p._id !== id));
      toast.success("Pet removed");
    } catch (err) {
      toast.error("Failed to delete pet");
    }
  };

  if (loading) return <div className="text-center py-8">Loading pets...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <input
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="🔍 Search by name or breed..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={openAdd} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold">
          + Add Pet
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["All", "Dog", "Cat", "Rabbit", "Other"].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1 rounded-full font-medium ${filter === t ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            {t} ({t === "All" ? pets.length : pets.filter((p) => p.species === t).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <div className="text-4xl mb-2">🐾</div>
          <div className="text-lg font-semibold">No pets found</div>
          <p>Try adjusting filters or add a new pet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((pet) => (
            <div key={pet._id} className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
              {/* Show real image or emoji fallback */}
              {pet.imageUrl ? (
                <img
                  src={pet.imageUrl}
                  alt={pet.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              ) : (
                <div className="w-full h-48 bg-orange-50 flex items-center justify-center text-6xl">
                  {pet.emoji || "🐾"}
                </div>
              )}
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <div className="text-lg font-semibold">{pet.name}</div>
                  <div className="text-sm text-gray-500">{pet.breed} · {pet.age} · {pet.gender}</div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  {STATUS_BADGE[pet.status]}
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(pet)} className="text-blue-500 hover:underline text-sm">Edit</button>
                    <button onClick={() => remove(pet._id)} className="text-red-500 hover:underline text-sm">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => e.target === e.currentTarget && setModal(false)}
        >
          <div className="bg-white rounded-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{editing ? "Edit Pet" : "Add New Pet"}</h3>
              <button onClick={() => setModal(false)} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                placeholder="Pet Name"
                value={form.name}
                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full"
              />
              <input
                placeholder="Breed"
                value={form.breed}
                onChange={(e) => setForm(f => ({ ...f, breed: e.target.value }))}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full"
              />
              <select
                value={form.species}
                onChange={(e) => setForm(f => ({ ...f, species: e.target.value }))}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full"
              >
                <option>Dog</option>
                <option>Cat</option>
                <option>Rabbit</option>
                <option>Other</option>
              </select>
              <input
                placeholder="Age (e.g. 2 years)"
                value={form.age}
                onChange={(e) => setForm(f => ({ ...f, age: e.target.value }))}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full"
              />
              <select
                value={form.gender}
                onChange={(e) => setForm(f => ({ ...f, gender: e.target.value }))}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full"
              >
                <option>Male</option>
                <option>Female</option>
              </select>
              <select
                value={form.status}
                onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full"
              >
                <option value="available">Available</option>
                <option value="review">Under Review</option>
                <option value="adopted">Adopted</option>
              </select>

              {/*  Image URL field */}
              <div className="col-span-2">
                <input
                  placeholder="Image URL (e.g. https://images.unsplash.com/...)"
                  value={form.imageUrl}
                  onChange={(e) => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                />
                {/*  Live image preview */}
                {form.imageUrl && (
                  <img
                    src={form.imageUrl}
                    alt="Preview"
                    className="mt-2 w-full h-40 object-cover rounded-lg border"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                )}
              </div>

              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full col-span-2"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setModal(false)} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">
                Cancel
              </button>
              <button onClick={save} className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600">
                {editing ? "Save Changes" : "Add Pet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
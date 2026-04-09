import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ExplorePets = () => {
  const navigate = useNavigate();
  const [allPets, setAllPets]       = useState([]);
  const [pets, setPets]             = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [loading, setLoading]       = useState(true);

  // Fetch from database
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/pets");
        setAllPets(data);
        setPets(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  // Filter whenever search or type changes
  useEffect(() => {
    let filtered = allPets;
    if (filterType !== "All") {
      filtered = filtered.filter(p => p.species === filterType);
    }
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.breed.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setPets(filtered);
  }, [searchTerm, filterType, allPets]);

  return (
    <div className="min-h-screen bg-yellow-100 py-10 px-6">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold text-orange-600 mb-2">Explore Pets</h1>
        <p className="text-gray-700">Find your perfect furry friend and give them a loving home.</p>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or breed..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="All">All Types</option>
          <option value="Dog">Dog</option>
          <option value="Cat">Cat</option>
          <option value="Rabbit">Rabbit</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 text-lg">Loading pets...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {pets.length > 0 ? pets.map(pet => (
            <div key={pet._id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
              {/* ✅ Real image or emoji fallback */}
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
              <div className="p-4">
                <h3 className="text-xl font-bold text-orange-600 mb-1">{pet.name}</h3>
                <p className="text-gray-700 text-sm mb-1">{pet.species} • {pet.breed} • {pet.age} • {pet.gender}</p>
                <p className="text-gray-600 text-sm mb-3">{pet.description}</p>
                <button
                  onClick={() => navigate(`/pets/${pet._id}`)}
                  className="bg-orange-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-orange-600 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          )) : (
            <p className="text-center text-gray-500 col-span-3">No pets found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ExplorePets;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FindOtherPets = () => {
  const navigate = useNavigate();
  const [allPets, setAllPets]           = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filters, setFilters]           = useState({
    breed: "Any", age: "Any", gender: "Any",
  });

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/pets");
        //  Everything that is not Dog or Cat
        const others = data.filter(p => p.species !== "Dog" && p.species !== "Cat");
        setAllPets(others);
        setFilteredPets(others);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  const breeds = ["Any", ...new Set(allPets.map(p => p.breed).filter(Boolean))];

  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const applyFilters = () => {
    const result = allPets.filter(pet =>
      (filters.breed  === "Any" || pet.breed  === filters.breed)  &&
      (filters.age    === "Any" || pet.age    === filters.age)    &&
      (filters.gender === "Any" || pet.gender === filters.gender)
    );
    setFilteredPets(result);
  };

  const resetFilters = () => {
    setFilters({ breed: "Any", age: "Any", gender: "Any" });
    setFilteredPets(allPets);
  };

  return (
    <div className="min-h-screen bg-yellow-50 px-8 py-6">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">Find Other Pets 🐾</h1>

      <div className="flex gap-8">
        <aside className="w-1/4 bg-white p-5 rounded-xl shadow-md h-fit sticky top-24">
          <h2 className="text-xl font-semibold text-orange-500 mb-4">Filters</h2>

          <div className="mb-4">
            <label className="font-semibold block mb-1">Type / Breed</label>
            <select name="breed" value={filters.breed} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
              {breeds.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>

          <div className="mb-4">
            <label className="font-semibold block mb-1">Age</label>
            <select name="age" value={filters.age} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
              <option>Any</option>
              <option>Young</option>
              <option>Adult</option>
              <option>Senior</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="font-semibold block mb-1">Gender</label>
            <select name="gender" value={filters.gender} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
              <option>Any</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          <button onClick={applyFilters} className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition mb-2">
            Apply Filters
          </button>
          <button onClick={resetFilters} className="w-full bg-gray-100 text-gray-600 py-2 rounded-lg hover:bg-gray-200 transition">
            Reset
          </button>
        </aside>

        <main className="w-3/4">
          {loading ? (
            <p className="text-gray-500 text-lg">Loading pets...</p>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {filteredPets.length > 0 ? filteredPets.map(pet => (
                <div key={pet._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                  {pet.imageUrl ? (
                    <img
                      src={pet.imageUrl}
                      alt={pet.name}
                      className="h-48 w-full object-cover"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  ) : (
                    <div className="h-48 w-full bg-orange-50 flex items-center justify-center text-6xl">
                      {pet.emoji || "🐾"}
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-orange-600">{pet.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{pet.species} • {pet.breed} • {pet.age} • {pet.gender}</p>
                    <button
                      onClick={() => navigate(`/pets/${pet._id}`)}
                      className="bg-orange-500 text-white px-4 py-1.5 rounded-lg hover:bg-orange-600 transition text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              )) : (
                <div className="col-span-3 flex flex-col items-center justify-center py-16 text-center">
                  <div className="text-5xl mb-4">🐾</div>
                  <p className="text-gray-500 text-lg font-medium">No pets match your filters.</p>
                  <p className="text-gray-400 text-sm mt-1">Try adjusting the filters or reset.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default FindOtherPets;

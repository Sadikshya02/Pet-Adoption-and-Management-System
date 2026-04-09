import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FindCat = () => {
  const navigate = useNavigate();
  const [allCats, setAllCats]           = useState([]);
  const [filteredCats, setFilteredCats] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filters, setFilters]           = useState({
    breed: "Any", age: "Any", gender: "Any",
  });

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/pets");
        const cats = data.filter(p => p.species === "Cat");
        setAllCats(cats);
        setFilteredCats(cats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  const breeds = ["Any", ...new Set(allCats.map(c => c.breed).filter(Boolean))];

  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const applyFilters = () => {
    const result = allCats.filter(cat =>
      (filters.breed  === "Any" || cat.breed  === filters.breed)  &&
      (filters.age    === "Any" || cat.age    === filters.age)    &&
      (filters.gender === "Any" || cat.gender === filters.gender)
    );
    setFilteredCats(result);
  };

  const resetFilters = () => {
    setFilters({ breed: "Any", age: "Any", gender: "Any" });
    setFilteredCats(allCats);
  };

  return (
    <div className="min-h-screen bg-yellow-50 px-8 py-6">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">Find a Cat </h1>

      <div className="flex gap-8">
        <aside className="w-1/4 bg-white p-5 rounded-xl shadow-md h-fit sticky top-24">
          <h2 className="text-xl font-semibold text-orange-500 mb-4">Filters</h2>

          <div className="mb-4">
            <label className="font-semibold block mb-1">Breed</label>
            <select name="breed" value={filters.breed} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
              {breeds.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>

          <div className="mb-4">
            <label className="font-semibold block mb-1">Age</label>
            <select name="age" value={filters.age} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
              <option>Any</option>
              <option>Kitten</option>
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
            <p className="text-gray-500 text-lg">Loading cats...</p>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {filteredCats.length > 0 ? filteredCats.map(cat => (
                <div key={cat._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                  {cat.imageUrl ? (
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="h-48 w-full object-cover"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  ) : (
                    <div className="h-48 w-full bg-orange-50 flex items-center justify-center text-6xl">
                      
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-orange-600">{cat.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{cat.breed} • {cat.age} • {cat.gender}</p>
                    <button
                      onClick={() => navigate(`/pets/${cat._id}`)}
                      className="bg-orange-500 text-white px-4 py-1.5 rounded-lg hover:bg-orange-600 transition text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              )) : (
                <div className="col-span-3 flex flex-col items-center justify-center py-16 text-center">
                  <div className="text-5xl mb-4"></div>
                  <p className="text-gray-500 text-lg font-medium">No cats match your filters.</p>
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

export default FindCat;
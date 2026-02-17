import React, { useState } from "react";

const FindCat = () => {
  // ================= CAT DATA =================
  const catsData = [
    // ===== LARGE =====
    {
      id: 1,
      name: "Oliver",
      breed: "Maine Coon",
      age: "Adult",
      size: "Large",
      gender: "Male",
      image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131",
    },
    {
      id: 2,
      name: "Luna",
      breed: "Ragdoll",
      age: "Young",
      size: "Large",
      gender: "Female",
      image: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8",
    },

    // ===== MEDIUM =====
    {
      id: 3,
      name: "Leo",
      breed: "British Shorthair",
      age: "Adult",
      size: "Medium",
      gender: "Male",
      image: "https://images.unsplash.com/photo-1511044568932-338cba0ad803",
    },
    {
      id: 4,
      name: "Milo",
      breed: "Bengal",
      age: "Young",
      size: "Medium",
      gender: "Male",
      image: "https://images.unsplash.com/photo-1501820488136-72669149e0d4",
    },
    {
      id: 5,
      name: "Chloe",
      breed: "Siamese",
      age: "Senior",
      size: "Medium",
      gender: "Female",
      image: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d",
    },

    // ===== SMALL =====
    {
      id: 6,
      name: "Bella",
      breed: "Persian",
      age: "Kitten",
      size: "Small",
      gender: "Female",
      image: "https://images.unsplash.com/photo-1503777119540-ce54b422baff",
    },
    {
      id: 7,
      name: "Simba",
      breed: "Abyssinian",
      age: "Young",
      size: "Small",
      gender: "Male",
      image: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4",
    },
    {
      id: 8,
      name: "Nala",
      breed: "Scottish Fold",
      age: "Adult",
      size: "Small",
      gender: "Female",
      image: "https://images.unsplash.com/photo-1494256997604-768d1f608cac",
    },
  ];

  // ================= STATES =================
  const [cats] = useState(catsData);
  const [filteredCats, setFilteredCats] = useState(catsData);

  const [filters, setFilters] = useState({
    breed: "Any",
    age: "Any",
    size: "Any",
    gender: "Any",
  });

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // ================= APPLY FILTER =================
  const applyFilters = () => {
    const result = cats.filter((cat) => {
      return (
        (filters.breed === "Any" || cat.breed === filters.breed) &&
        (filters.age === "Any" || cat.age === filters.age) &&
        (filters.size === "Any" || cat.size === filters.size) &&
        (filters.gender === "Any" || cat.gender === filters.gender)
      );
    });

    setFilteredCats(result);
  };

  return (
    <div className="min-h-screen bg-yellow-50 px-8 py-6">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">
        Find a Cat 🐱
      </h1>

      <div className="flex gap-8">
        {/* ================= FILTER SIDEBAR ================= */}
        <aside className="w-1/4 bg-white p-5 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-orange-500 mb-4">
            Filters
          </h2>

          {/* Breed */}
          <div className="mb-4">
            <label className="font-semibold block mb-1">Breed</label>
            <select
              name="breed"
              value={filters.breed}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option>Any</option>
              <option>Maine Coon</option>
              <option>Ragdoll</option>
              <option>British Shorthair</option>
              <option>Bengal</option>
              <option>Siamese</option>
              <option>Persian</option>
              <option>Abyssinian</option>
              <option>Scottish Fold</option>
            </select>
          </div>

          {/* Age */}
          <div className="mb-4">
            <label className="font-semibold block mb-1">Age</label>
            <select
              name="age"
              value={filters.age}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option>Any</option>
              <option>Kitten</option>
              <option>Young</option>
              <option>Adult</option>
              <option>Senior</option>
            </select>
          </div>

          {/* Size */}
          <div className="mb-4">
            <label className="font-semibold block mb-1">Size</label>
            <select
              name="size"
              value={filters.size}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option>Any</option>
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
            </select>
          </div>

          {/* Gender */}
          <div className="mb-6">
            <label className="font-semibold block mb-1">Gender</label>
            <select
              name="gender"
              value={filters.gender}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option>Any</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          <button
            onClick={applyFilters}
            className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
          >
            Apply Filters
          </button>
        </aside>

        {/* ================= CAT LIST ================= */}
        <main className="w-3/4 grid grid-cols-3 gap-6">
          {filteredCats.length > 0 ? (
            filteredCats.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-orange-600">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {cat.breed} • {cat.age} • {cat.size} • {cat.gender}
                  </p>
                  <button className="mt-3 bg-orange-500 text-white px-3 py-1 rounded-lg hover:bg-orange-600">
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-lg">
              No cats match your filters.
            </p>
          )}
        </main>
      </div>
    </div>
  );
};

export default FindCat;

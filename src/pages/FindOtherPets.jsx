import React, { useState } from "react";

const FindOtherPets = () => {
  // ================= OTHER PET DATA =================
  const petsData = [
    {
      id: 1,
      name: "Coco",
      breed: "Parrot",
      age: "Young",
      size: "Small",
      gender: "Female",
      image: "https://images.unsplash.com/photo-1552728089-57bdde30beb3",
    },
    {
      id: 2,
      name: "Thumper",
      breed: "Rabbit",
      age: "Adult",
      size: "Medium",
      gender: "Male",
      image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308",
    },
    {
      id: 3,
      name: "Nibbles",
      breed: "Hamster",
      age: "Puppy",
      size: "Small",
      gender: "Male",
      image: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca",
    },
    {
      id: 4,
      name: "Goldie",
      breed: "Goldfish",
      age: "Young",
      size: "Small",
      gender: "Female",
      image: "https://images.unsplash.com/photo-1504893524553-b855bce32c67",
    },
    {
      id: 5,
      name: "Spike",
      breed: "Iguana",
      age: "Senior",
      size: "Large",
      gender: "Male",
      image: "https://images.unsplash.com/photo-1516750105099-4b8a83e217ee",
    },
    {
      id: 6,
      name: "Snowball",
      breed: "Rabbit",
      age: "Puppy",
      size: "Medium",
      gender: "Female",
      image: "https://images.unsplash.com/photo-1574158622682-e40e69881006",
    },
  ];

  // ================= STATES =================
  const [pets] = useState(petsData);
  const [filteredPets, setFilteredPets] = useState(petsData);

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
    const result = pets.filter((pet) => {
      return (
        (filters.breed === "Any" || pet.breed === filters.breed) &&
        (filters.age === "Any" || pet.age === filters.age) &&
        (filters.size === "Any" || pet.size === filters.size) &&
        (filters.gender === "Any" || pet.gender === filters.gender)
      );
    });

    setFilteredPets(result);
  };

  return (
    <div className="min-h-screen bg-yellow-50 px-8 py-6">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">
        Find Other Pets 🐾
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
              <option>Parrot</option>
              <option>Rabbit</option>
              <option>Hamster</option>
              <option>Goldfish</option>
              <option>Iguana</option>
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
              <option>Puppy</option>
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

        {/* ================= PET LIST ================= */}
        <main className="w-3/4 grid grid-cols-3 gap-6">
          {filteredPets.length > 0 ? (
            filteredPets.map((pet) => (
              <div
                key={pet.id}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-orange-600">
                    {pet.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {pet.breed} • {pet.age} • {pet.size} • {pet.gender}
                  </p>
                  <button className="mt-3 bg-orange-500 text-white px-3 py-1 rounded-lg hover:bg-orange-600">
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-lg">
              No pets match your filters.
            </p>
          )}
        </main>
      </div>
    </div>
  );
};

export default FindOtherPets;

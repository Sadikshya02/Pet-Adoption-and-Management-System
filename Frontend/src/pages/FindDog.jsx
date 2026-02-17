import React, { useState } from "react";

const FindDog = () => {
  // ================= DOG DATA =================
  const dogsData = [
    // ===== LARGE =====
    {
      id: 1,
      name: "Buddy",
      breed: "Golden Retriever",
      age: "Young",
      size: "Large",
      gender: "Male",
      image: "https://images.unsplash.com/photo-1558788353-f76d92427f16",
    },
    {
      id: 2,
      name: "Luna",
      breed: "Husky",
      age: "Adult",
      size: "Large",
      gender: "Female",
      image: "https://images.unsplash.com/photo-1605568427561-40dd23c2acea",
    },
    {
      id: 3,
      name: "Rocky",
      breed: "German Shepherd",
      age: "Senior",
      size: "Large",
      gender: "Male",
      image: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95",
    },
    {
      id: 4,
      name: "Daisy",
      breed: "Labrador",
      age: "Puppy",
      size: "Large",
      gender: "Female",
      image: "https://images.unsplash.com/photo-1591769225440-811ad7d6eab3",
    },

    // ===== MEDIUM =====
    {
      id: 5,
      name: "Max",
      breed: "Beagle",
      age: "Young",
      size: "Medium",
      gender: "Male",
      image: "https://images.unsplash.com/photo-1507146426996-ef05306b995a",
    },
    {
      id: 6,
      name: "Bella",
      breed: "Border Collie",
      age: "Adult",
      size: "Medium",
      gender: "Female",
      image: "https://images.unsplash.com/photo-1554692918-08fa0fdc9db3",
    },
    {
      id: 7,
      name: "Cooper",
      breed: "Bulldog",
      age: "Senior",
      size: "Medium",
      gender: "Male",
      image: "https://images.unsplash.com/photo-1546525848-3ce03ca516f6",
    },
    {
      id: 8,
      name: "Ruby",
      breed: "Cocker Spaniel",
      age: "Puppy",
      size: "Medium",
      gender: "Female",
      image: "https://images.unsplash.com/photo-1598133894009-61f7fdb8cc3a",
    },

    // ===== SMALL =====
    {
      id: 9,
      name: "Milo",
      breed: "Pomeranian",
      age: "Puppy",
      size: "Small",
      gender: "Male",
      image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1",
    },
    {
      id: 10,
      name: "Chloe",
      breed: "Chihuahua",
      age: "Young",
      size: "Small",
      gender: "Female",
      image: "https://images.unsplash.com/photo-1517849845537-4d257902454a",
    },
    {
      id: 11,
      name: "Teddy",
      breed: "Shih Tzu",
      age: "Adult",
      size: "Small",
      gender: "Male",
      image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e",
    },
    {
      id: 12,
      name: "Lily",
      breed: "Pug",
      age: "Senior",
      size: "Small",
      gender: "Female",
      image: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9",
    },
  ];

  // ================= STATES =================
  const [dogs] = useState(dogsData);
  const [filteredDogs, setFilteredDogs] = useState(dogsData);

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
    const result = dogs.filter((dog) => {
      return (
        (filters.breed === "Any" || dog.breed === filters.breed) &&
        (filters.age === "Any" || dog.age === filters.age) &&
        (filters.size === "Any" || dog.size === filters.size) &&
        (filters.gender === "Any" || dog.gender === filters.gender)
      );
    });

    setFilteredDogs(result);
  };

  return (
    <div className="min-h-screen bg-yellow-50 px-8 py-6">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">
        Find a Dog 🐶
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
              <option>Golden Retriever</option>
              <option>Husky</option>
              <option>Labrador</option>
              <option>German Shepherd</option>
              <option>Beagle</option>
              <option>Border Collie</option>
              <option>Bulldog</option>
              <option>Cocker Spaniel</option>
              <option>Pomeranian</option>
              <option>Chihuahua</option>
              <option>Shih Tzu</option>
              <option>Pug</option>
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

        {/* ================= DOG LIST ================= */}
        <main className="w-3/4 grid grid-cols-3 gap-6">
          {filteredDogs.length > 0 ? (
            filteredDogs.map((dog) => (
              <div
                key={dog.id}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <img
                  src={dog.image}
                  alt={dog.name}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-orange-600">
                    {dog.name}
                  </h3>

                  {/* HERE IS THE UPDATE YOU WANTED */}
                  <p className="text-sm text-gray-600">
                    {dog.breed} • {dog.age} • {dog.size} • {dog.gender}
                  </p>

                  <button className="mt-3 bg-orange-500 text-white px-3 py-1 rounded-lg hover:bg-orange-600">
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-lg">
              No dogs match your filters.
            </p>
          )}
        </main>
      </div>
    </div>
  );
};

export default FindDog;

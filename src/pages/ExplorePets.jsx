import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Example pet data (replace or fetch from API later)
const petsData = [
  { id: 1, name: "Buddy", type: "Dog", age: "2 years", image: "/assets/pet1.jpg", description: "Friendly and energetic." },
  { id: 2, name: "Mittens", type: "Cat", age: "1 year", image: "/assets/pet2.jpg", description: "Playful and loving." },
  { id: 3, name: "Charlie", type: "Dog", age: "3 years", image: "/assets/pet3.jpg", description: "Loyal and curious." },
  { id: 4, name: "Luna", type: "Cat", age: "2 years", image: "/assets/pet4.jpg", description: "Gentle and affectionate." }
];

const ExplorePets = () => {
  const [pets, setPets] = useState(petsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");

  // Filter pets whenever search term or type changes
  useEffect(() => {
    let filtered = petsData;

    if (filterType !== "All") {
      filtered = filtered.filter(pet => pet.type === filterType);
    }

    if (searchTerm) {
      filtered = filtered.filter(pet =>
        pet.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setPets(filtered);
  }, [searchTerm, filterType]);

  return (
    <div className="min-h-screen bg-yellow-100 py-10 px-6">

      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold text-orange-600 mb-2">Explore Pets</h1>
        <p className="text-gray-700">
          Find your perfect furry friend and give them a loving home.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
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
        </select>
      </div>

      {/* Pet Cards */}
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {pets.length > 0 ? (
          pets.map(pet => (
            <div key={pet.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
              <img src={pet.image} alt={pet.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-bold text-orange-600 mb-1">{pet.name}</h3>
                <p className="text-gray-700 text-sm mb-1">{pet.type} • {pet.age}</p>
                <p className="text-gray-600 text-sm mb-3">{pet.description}</p>
                <Link
                  to={`/pet/${pet.id}`}
                  className="bg-orange-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-orange-600 transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-3">No pets found.</p>
        )}
      </div>
    </div>
  );
};

export default ExplorePets;

import React from "react";
import { Link } from "react-router-dom";

const pets = [
  {
    id: 1,
    name: "Buddy",
    type: "Golden Retriever",
    age: "2 years",
    image: "/assets/pet1.jpg", // replace with your image path
    description: "Friendly and energetic, perfect for families."
  },
  {
    id: 2,
    name: "Mittens",
    type: "Tabby Cat",
    age: "1 year",
    image: "/assets/pet2.jpg",
    description: "Playful and loving, enjoys cuddles."
  },
  {
    id: 3,
    name: "Charlie",
    type: "Beagle",
    age: "3 years",
    image: "/assets/pet3.jpg",
    description: "Loyal and curious, loves outdoor walks."
  }
];

const Home = () => {
  return (
    <div className="min-h-screen bg-yellow-100 py-10 px-6">

      {/* Top Section - Landing Page Text */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-5xl font-bold text-orange-600 mb-4">
          Furever Home
        </h1>
        <p className="text-gray-700 text-lg mb-6">
          Discover your perfect pet companion and give them a loving home. Join us today!
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/signup"
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Get Started
          </Link>
          <Link
            to="/learn"
            className="px-6 py-3 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition"
          >
            Learn More
          </Link>
        </div>
      </div>

      {/* Pet Cards */}
      <h2 className="text-3xl font-bold text-orange-600 text-center mb-8">
        Meet Our Lovely Pets
      </h2>
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {pets.map((pet) => (
          <div
            key={pet.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={pet.image}
              alt={pet.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-bold text-orange-600 mb-1">{pet.name}</h3>
              <p className="text-gray-700 text-sm mb-1">
                {pet.type} • {pet.age}
              </p>
              <p className="text-gray-600 text-sm mb-3">{pet.description}</p>
              <button className="bg-orange-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-orange-600 transition">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Home;

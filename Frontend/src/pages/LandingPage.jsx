import React from "react";
import { Link } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import Charlie from "../assets/charlie.jpeg";
import tabbycat from "../assets/tabbycat.jpeg";
import GoldenRetriever from "../assets/goldenRetriever.jpeg";

const pets = [
  {
    id: 1,
    name: "Buddy",
    type: "Golden Retriever",
    age: "2 years",
    image: GoldenRetriever,
    description: "Friendly and energetic, perfect for families."
  },
  {
    id: 2,
    name: "Mittens",
    type: "Tabby Cat",
    age: "1 year",
    image: tabbycat,
    description: "Playful and loving, enjoys cuddles."
  },
  {
    id: 3,
    name: "Charlie",
    type: "Husky",
    age: "3 years",
    image: Charlie,
    description: "Loyal and curious, loves outdoor walks."
  }
];

const Home = () => {
  return (
    <>
      {/* Main Content */}
      <div className="min-h-screen bg-yellow-100 py-10 px-6">
        {/* Button on the right */}



        {/* Centered Main Content */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          {/* Hero Section */}
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
                <h3 className="text-xl font-bold text-orange-600 mb-1">
                  {pet.name}
                </h3>
                <p className="text-gray-700 text-sm mb-1">
                  {pet.type} • {pet.age}
                </p>
                <p className="text-gray-600 text-sm mb-3">
                  {pet.description}
                </p>
                {/* ✅ Fixed: changed /pets/ to /petpage/ */}
                <Link
                  to={`/petpage/${pet.id}`}
                  className="inline-block bg-orange-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-orange-600 transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-orange-600 text-white mt-16">
        <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-2">Furever Home</h3>
            <p className="text-sm text-orange-100">
              Helping pets find loving homes and families find loyal companions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:underline">Home</Link>
              </li>
              <li>
                <Link to="/signup" className="hover:underline">Adopt a Pet</Link>
              </li>
              <li>
                <Link to="/login" className="hover:underline">Login</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-3">Contact Us</h4>
            <p className="text-sm">📍 Kathmandu, Nepal</p>
            <p className="text-sm">📧 support@fureverhome.com</p>
            <p className="text-sm">📞 +977 98XXXXXXXX</p>
          </div>
        </div>

        <div className="border-t border-orange-500 text-center py-4 text-sm text-orange-100">
          © {new Date().getFullYear()} Furever Home. All rights reserved.
        </div>
      </footer>
    </>
  );
};

export default Home;
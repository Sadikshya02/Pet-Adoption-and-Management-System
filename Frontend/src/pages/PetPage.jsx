import React from "react";
import { useParams, Link } from "react-router-dom";
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
    description: "Friendly and energetic, perfect for families.",
    breed: "Golden Retriever",
    gender: "Male",
    color: "Golden",
    vaccinated: true,
    neutered: true,
    personality: ["Playful", "Friendly", "Gentle", "Obedient"],
    longDescription:
      "Buddy is a cheerful 2-year-old Golden Retriever who loves everyone he meets. He's great with kids, other dogs, and even cats! He knows basic commands like sit, stay, and fetch. Buddy thrives in active households and would love a family with a yard where he can run and play.",
  },
  {
    id: 2,
    name: "Mittens",
    type: "Tabby Cat",
    age: "1 year",
    image: tabbycat,
    description: "Playful and loving, enjoys cuddles.",
    breed: "Domestic Shorthair",
    gender: "Female",
    color: "Orange & White",
    vaccinated: true,
    neutered: false,
    personality: ["Curious", "Cuddly", "Playful", "Calm"],
    longDescription:
      "Mittens is a sweet 1-year-old tabby cat who loves to curl up on laps and purr. She enjoys chasing toy mice and watching birds from the window. Mittens is litter-trained and does well in apartments. She's looking for a calm and loving home where she can be the center of attention.",
  },
  {
    id: 3,
    name: "Charlie",
    type: "Husky",
    age: "3 years",
    image: Charlie,
    description: "Loyal and curious, loves outdoor walks.",
    breed: "Siberian Husky",
    gender: "Male",
    color: "Grey & White",
    vaccinated: true,
    neutered: true,
    personality: ["Energetic", "Loyal", "Intelligent", "Adventurous"],
    longDescription:
      "Charlie is a stunning 3-year-old Siberian Husky full of energy and personality. He loves long hikes, cold weather, and learning new tricks. Charlie bonds deeply with his family and is great with older children. He needs plenty of exercise and mental stimulation — ideal for an active owner who loves the outdoors.",
  },
];

const PetPage = () => {
  const { id } = useParams();
  const pet = pets.find((p) => p.id === parseInt(id));

  if (!pet) {
    return (
      <div className="min-h-screen bg-yellow-100 flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-orange-600 mb-4">Pet Not Found</h2>
        <Link to="/" className="text-orange-500 underline">← Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-100 py-10 px-6">
      <div className="max-w-4xl mx-auto">

        <Link to="/" className="text-orange-500 hover:underline text-sm mb-6 inline-block">
          ← Back to All Pets
        </Link>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <img
            src={pet.image}
            alt={pet.name}
            className="w-full h-72 object-cover"
          />

          <div className="p-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-4xl font-bold text-orange-600">{pet.name}</h1>
              <span className="bg-orange-100 text-orange-600 text-sm font-semibold px-3 py-1 rounded-full">
                {pet.type}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
              {[
                { label: "Age", value: pet.age },
                { label: "Gender", value: pet.gender },
                { label: "Breed", value: pet.breed },
                { label: "Color", value: pet.color },
              ].map((info) => (
                <div key={info.label} className="bg-yellow-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">{info.label}</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">{info.value}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mb-6">
              <span className={`text-sm px-3 py-1 rounded-full font-medium ${pet.vaccinated ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                {pet.vaccinated ? "✓ Vaccinated" : "✗ Not Vaccinated"}
              </span>
              <span className={`text-sm px-3 py-1 rounded-full font-medium ${pet.neutered ? "bg-green-100 text-green-700" : "bg-yellow-200 text-yellow-700"}`}>
                {pet.neutered ? "✓ Neutered" : "Not Neutered"}
              </span>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Personality</h3>
              <div className="flex flex-wrap gap-2">
                {pet.personality.map((trait) => (
                  <span key={trait} className="bg-orange-100 text-orange-700 text-sm px-3 py-1 rounded-full">
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">About {pet.name}</h3>
              <p className="text-gray-600 leading-relaxed">{pet.longDescription}</p>
            </div>

            <Link
              to="/signup"
              className="inline-block bg-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-600 transition text-center"
            >
              Adopt {pet.name} 
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetPage;
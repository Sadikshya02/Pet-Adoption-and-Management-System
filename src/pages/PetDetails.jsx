import React from "react";
import { useParams, Link } from "react-router-dom";
import { petsData } from "../data/petsData";

const PetDetails = () => {
  const { id } = useParams();
  const pet = petsData.find(p => p.id === parseInt(id));

  if (!pet) return <h2 className="p-10 text-xl">Pet not found</h2>;

  return (
    <div className="min-h-screen bg-yellow-50 p-10">
      <Link to={`/find-${pet.species.toLowerCase()}`} className="text-orange-500 font-semibold underline">
        ← Back
      </Link>

      <div className="mt-6 bg-white shadow-lg rounded-xl max-w-4xl mx-auto overflow-hidden">
        <img
          src={pet.image || "https://via.placeholder.com/600x400"}
          alt={pet.name}
          className="w-full h-96 object-cover"
        />

        <div className="p-6 space-y-4 text-gray-700">
          <h1 className="text-3xl font-bold text-orange-600">{pet.name}</h1>

          <div>
            <h2 className="font-semibold">Location</h2>
            <p>{pet.location}</p>
          </div>

          <div>
            <h2 className="font-semibold">Breed</h2>
            <p>{pet.breed.join(" & ")}</p>
          </div>

          <div>
            <h2 className="font-semibold">Physical Traits</h2>
            <p>Age: {pet.age}</p>
            <p>Gender: {pet.gender}</p>
            <p>Size: {pet.size}</p>
          </div>

          <div>
            <h2 className="font-semibold">Behavior</h2>
            <p>House-trained: {pet.behavior.houseTrained}</p>
          </div>

          <div>
            <h2 className="font-semibold">Health</h2>
            <p>Spayed/Neutered: {pet.health.spayedNeutered}</p>
            <p>Vaccinated: {pet.health.vaccinated}</p>
            <p>Special Needs: {pet.health.specialNeeds}</p>
          </div>

          <div>
            <h2 className="font-semibold">Compatibility</h2>
            <p>Kids: {pet.compatibility.kids}</p>
            <p>Dogs: {pet.compatibility.dogs}</p>
            <p>Cats: {pet.compatibility.cats}</p>
            <p>Other Animals: {pet.compatibility.otherAnimals}</p>
          </div>

          <div>
            <h2 className="font-semibold">Story</h2>
            <p>{pet.story}</p>
          </div>

          <div>
            <h2 className="font-semibold">How to Adopt</h2>
            <p>{pet.adoptionInfo}</p>
          </div>

          <button className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
            Start Your Inquiry ❤️
          </button>
        </div>
      </div>
    </div>
  );
};

export default PetDetails;

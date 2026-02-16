import React from "react";

const PetCard = ({ pet }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition">
      <img
        src={pet.image}
        alt={pet.name}
        className="w-full h-48 object-cover rounded-md mb-3"
      />
      <h2 className="text-xl font-bold">{pet.name}</h2>
      <p className="text-gray-600">Type: {pet.type}</p>
      <p className="text-gray-600">Age: {pet.age} years</p>
      <p className="text-gray-600">Care Level: {pet.careLevel}</p>
      <p className="text-gray-600">Grooming: {pet.groomingNeeded}</p>
    </div>
  );
};

export default PetCard;

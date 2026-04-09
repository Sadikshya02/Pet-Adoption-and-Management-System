import mongoose from "mongoose";
import Pet from "./models/Pet.js";


await mongoose.connect("mongodb+srv://sadikshya:sadikshya123@cluster0.ychhafk.mongodb.net/PetAdoption?retryWrites=true&w=majority");

const traitMap = {
  Dog: {
    traits: {
      energy: 8, social: 9, maintenance: 6,
      suitableFor: { apartment: false, children: true, allergies: false, beginners: true },
    },
    tags: ["playful", "loyal", "friendly"],
  },
  Cat: {
    traits: {
      energy: 4, social: 5, maintenance: 4,
      suitableFor: { apartment: true, children: false, allergies: false, beginners: true },
    },
    tags: ["independent", "calm", "quiet"],
  },
  Rabbit: {
    traits: {
      energy: 4, social: 5, maintenance: 5,
      suitableFor: { apartment: true, children: true, allergies: false, beginners: false },
    },
    tags: ["gentle", "quiet", "compact"],
  },
  Other: {
    traits: {
      energy: 3, social: 3, maintenance: 3,
      suitableFor: { apartment: true, children: true, allergies: true, beginners: true },
    },
    tags: ["low-maintenance", "unique"],
  },
};

const pets = await Pet.find();

for (const pet of pets) {
  const defaults = traitMap[pet.species] || traitMap["Other"];
  await Pet.findByIdAndUpdate(pet._id, {
    traits: defaults.traits,
    tags: defaults.tags,
  });
  console.log(` Updated: ${pet.name} (${pet.species})`);
}

console.log("🎉 All pets updated with traits!");
mongoose.disconnect();
import mongoose from "mongoose";
import Pet from "./models/Pet.js";

await mongoose.connect("mongodb+srv://sadikshya:sadikshya123@cluster0.ychhafk.mongodb.net/PetAdoption?retryWrites=true&w=majority");

const dogs = [
  {
    name: "Rocky", breed: "German Shepherd", species: "Dog",
    age: "Young", gender: "Male", status: "available",
    emoji: "🐕", imageUrl: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=600&auto=format&fit=crop",
    description: "Rocky is a bold and intelligent German Shepherd who loves outdoor adventures. He's well-trained and great with experienced owners.",
    traits: { energy: 9, social: 8, maintenance: 6, suitableFor: { apartment: false, children: true, allergies: false, beginners: false } },
    tags: ["Trained", "Active", "Vaccinated"],
  },
  {
    name: "Bella", breed: "French Bulldog", species: "Dog",
    age: "Adult", gender: "Female", status: "available",
    emoji: "🐶", imageUrl: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop",
    description: "Bella is a charming French Bulldog who loves cuddles and short walks. Perfect for apartment living.",
    traits: { energy: 4, social: 8, maintenance: 5, suitableFor: { apartment: true, children: true, allergies: false, beginners: true } },
    tags: ["Calm", "Friendly", "Indoor"],
  },
  {
    name: "Charlie", breed: "Poodle", species: "Dog",
    age: "Puppy", gender: "Male", status: "available",
    emoji: "🐩", imageUrl: "https://images.unsplash.com/photo-1617895153857-82fe79b6e9d5?w=600&auto=format&fit=crop",
    description: "Charlie is a playful Poodle puppy who is incredibly smart and easy to train. Great for families with allergies.",
    traits: { energy: 8, social: 9, maintenance: 8, suitableFor: { apartment: true, children: true, allergies: true, beginners: true } },
    tags: ["Hypoallergenic", "Playful", "Vaccinated"],
  },
  {
    name: "Max", breed: "Border Collie", species: "Dog",
    age: "Young", gender: "Male", status: "available",
    emoji: "🐕", imageUrl: "https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?w=600&auto=format&fit=crop",
    description: "Max is an incredibly intelligent Border Collie who thrives when he has a job to do. Best for active owners with space.",
    traits: { energy: 10, social: 7, maintenance: 7, suitableFor: { apartment: false, children: true, allergies: false, beginners: false } },
    tags: ["Intelligent", "Active", "Trained"],
  },
  {
    name: "Daisy", breed: "Cavalier King Charles Spaniel", species: "Dog",
    age: "Adult", gender: "Female", status: "available",
    emoji: "🐶", imageUrl: "https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=600&auto=format&fit=crop",
    description: "Daisy is a gentle and affectionate Cavalier who loves being around people. She's calm, easy-going, and great with kids.",
    traits: { energy: 4, social: 10, maintenance: 5, suitableFor: { apartment: true, children: true, allergies: false, beginners: true } },
    tags: ["Gentle", "Friendly", "Vaccinated"],
  },
  {
    name: "Bruno", breed: "Rottweiler", species: "Dog",
    age: "Adult", gender: "Male", status: "available",
    emoji: "🐕", imageUrl: "https://images.unsplash.com/photo-1567752881298-894bb81f9379?w=600&auto=format&fit=crop",
    description: "Bruno is a loyal and protective Rottweiler who is incredibly gentle with his family. Needs an experienced handler.",
    traits: { energy: 7, social: 6, maintenance: 5, suitableFor: { apartment: false, children: true, allergies: false, beginners: false } },
    tags: ["Loyal", "Protective", "Vaccinated"],
  },
  {
    name: "Lily", breed: "Shih Tzu", species: "Dog",
    age: "Senior", gender: "Female", status: "available",
    emoji: "🐶", imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&auto=format&fit=crop",
    description: "Lily is a sweet senior Shih Tzu looking for a quiet home where she can enjoy lap time and gentle walks.",
    traits: { energy: 3, social: 7, maintenance: 7, suitableFor: { apartment: true, children: false, allergies: false, beginners: true } },
    tags: ["Calm", "Indoor", "Gentle"],
  },
  {
    name: "Zeus", breed: "Siberian Husky", species: "Dog",
    age: "Young", gender: "Male", status: "available",
    emoji: "🐕", imageUrl: "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=600&auto=format&fit=crop",
    description: "Zeus is a stunning Siberian Husky with striking blue eyes. He's energetic, vocal, and loves cold weather and long runs.",
    traits: { energy: 10, social: 8, maintenance: 7, suitableFor: { apartment: false, children: true, allergies: false, beginners: false } },
    tags: ["Active", "Playful", "Vaccinated"],
  },
  {
    name: "Rosie", breed: "Cocker Spaniel", species: "Dog",
    age: "Puppy", gender: "Female", status: "available",
    emoji: "🐶", imageUrl: "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=600&auto=format&fit=crop",
    description: "Rosie is an adorable Cocker Spaniel puppy with silky ears and a loving nature. She gets along with everyone.",
    traits: { energy: 7, social: 9, maintenance: 7, suitableFor: { apartment: true, children: true, allergies: false, beginners: true } },
    tags: ["Playful", "Friendly", "Vaccinated"],
  },
  {
    name: "Thor", breed: "Doberman", species: "Dog",
    age: "Young", gender: "Male", status: "available",
    emoji: "🐕", imageUrl: "https://images.unsplash.com/photo-1616149368139-b27a3a6ba20a?w=600&auto=format&fit=crop",
    description: "Thor is a sleek and powerful Doberman who is fiercely loyal to his family. He's alert, obedient, and highly trainable.",
    traits: { energy: 9, social: 7, maintenance: 5, suitableFor: { apartment: false, children: true, allergies: false, beginners: false } },
    tags: ["Loyal", "Trained", "Active"],
  },
  {
    name: "Coco", breed: "Dachshund", species: "Dog",
    age: "Adult", gender: "Female", status: "available",
    emoji: "🐶", imageUrl: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&auto=format&fit=crop",
    description: "Coco is a feisty little Dachshund with a big personality. She loves to sniff around and curl up on the couch.",
    traits: { energy: 5, social: 7, maintenance: 4, suitableFor: { apartment: true, children: false, allergies: false, beginners: true } },
    tags: ["Curious", "Friendly", "Indoor"],
  },
  {
    name: "Duke", breed: "Great Dane", species: "Dog",
    age: "Young", gender: "Male", status: "available",
    emoji: "🐕", imageUrl: "https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=600&auto=format&fit=crop",
    description: "Duke is a gentle giant Great Dane who despite his size is calm and friendly. He needs space but is surprisingly low energy.",
    traits: { energy: 5, social: 8, maintenance: 5, suitableFor: { apartment: false, children: true, allergies: false, beginners: true } },
    tags: ["Gentle", "Calm", "Vaccinated"],
  },
  {
    name: "Luna", breed: "Australian Shepherd", species: "Dog",
    age: "Young", gender: "Female", status: "available",
    emoji: "🐕", imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&auto=format&fit=crop",
    description: "Luna is a stunning Australian Shepherd with a merle coat. She's highly intelligent, agile, and loves learning new tricks.",
    traits: { energy: 9, social: 8, maintenance: 7, suitableFor: { apartment: false, children: true, allergies: false, beginners: false } },
    tags: ["Intelligent", "Active", "Playful"],
  },
  {
    name: "Teddy", breed: "Pomeranian", species: "Dog",
    age: "Puppy", gender: "Male", status: "available",
    emoji: "🐶", imageUrl: "https://images.unsplash.com/photo-1591768793355-74d04bb6608f?w=600&auto=format&fit=crop",
    description: "Teddy is a fluffy little Pomeranian who thinks he's the biggest dog in the room. Full of personality and love.",
    traits: { energy: 6, social: 8, maintenance: 8, suitableFor: { apartment: true, children: false, allergies: false, beginners: true } },
    tags: ["Fluffy", "Playful", "Friendly"],
  },
  {
    name: "Sadie", breed: "Boxer", species: "Dog",
    age: "Adult", gender: "Female", status: "available",
    emoji: "🐕", imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop",
    description: "Sadie is a fun-loving Boxer who is endlessly playful and great with kids. She has tons of energy and loves to run.",
    traits: { energy: 9, social: 9, maintenance: 5, suitableFor: { apartment: false, children: true, allergies: false, beginners: true } },
    tags: ["Playful", "Friendly", "Active"],
  },
];

console.log("🌱 Seeding dogs...");

for (const dog of dogs) {
  const exists = await Pet.findOne({ name: dog.name, breed: dog.breed });
  if (exists) {
    await Pet.findOneAndUpdate({ name: dog.name, breed: dog.breed }, { imageUrl: dog.imageUrl });
    console.log(`🔄 Updated image: ${dog.name} — ${dog.breed}`);
  } else {
    await Pet.create(dog);
    console.log(`✅ Added: ${dog.name} — ${dog.breed}`);
  }
}

console.log("🎉 Done seeding dogs!");
mongoose.disconnect();
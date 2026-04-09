import mongoose from "mongoose";
import Pet from "./models/Pet.js";

await mongoose.connect("mongodb+srv://sadikshya:sadikshya123@cluster0.ychhafk.mongodb.net/PetAdoption?retryWrites=true&w=majority");

const cats = [
  {
    name: "Luna", breed: "Persian", species: "Cat",
    age: "Adult", gender: "Female", status: "available",
    emoji: "🐱", imageUrl: "https://images.unsplash.com/photo-1518791841217-8f162f1912da?w=600&auto=format&fit=crop",
    description: "Luna is a gorgeous Persian cat with a silky white coat. She loves being brushed and sitting by the window watching the world go by.",
    traits: { energy: 3, social: 6, maintenance: 8, suitableFor: { apartment: true, children: false, allergies: false, beginners: true } },
    tags: ["Calm", "Indoor", "Vaccinated"],
  },
  {
    name: "Simba", breed: "Maine Coon", species: "Cat",
    age: "Young", gender: "Male", status: "available",
    emoji: "🐱", imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop",
    description: "Simba is a magnificent Maine Coon with a fluffy mane and a dog-like personality. He loves following his humans around the house.",
    traits: { energy: 7, social: 9, maintenance: 7, suitableFor: { apartment: true, children: true, allergies: false, beginners: true } },
    tags: ["Friendly", "Playful", "Vaccinated"],
  },
  {
    name: "Nala", breed: "Siamese", species: "Cat",
    age: "Adult", gender: "Female", status: "available",
    emoji: "🐱", imageUrl: "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=600&auto=format&fit=crop",
    description: "Nala is a vocal and affectionate Siamese who always wants to be part of the conversation. She bonds deeply with her owner.",
    traits: { energy: 7, social: 10, maintenance: 4, suitableFor: { apartment: true, children: true, allergies: false, beginners: true } },
    tags: ["Vocal", "Affectionate", "Vaccinated"],
  },
  {
    name: "Oliver", breed: "British Shorthair", species: "Cat",
    age: "Adult", gender: "Male", status: "available",
    emoji: "🐱", imageUrl: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&auto=format&fit=crop",
    description: "Oliver is a round-faced British Shorthair with a calm and easygoing temperament. He's independent but loves a good cuddle session.",
    traits: { energy: 3, social: 6, maintenance: 4, suitableFor: { apartment: true, children: true, allergies: false, beginners: true } },
    tags: ["Calm", "Independent", "Indoor"],
  },
  {
    name: "Mia", breed: "Ragdoll", species: "Cat",
    age: "Young", gender: "Female", status: "available",
    emoji: "🐱", imageUrl: "https://images.unsplash.com/photo-1561948955-570b270e7c36?w=600&auto=format&fit=crop",
    description: "Mia is a stunning Ragdoll who goes completely limp when you pick her up. She's gentle, quiet and loves being held.",
    traits: { energy: 3, social: 8, maintenance: 6, suitableFor: { apartment: true, children: true, allergies: false, beginners: true } },
    tags: ["Gentle", "Calm", "Vaccinated"],
  },
  {
    name: "Leo", breed: "Bengal", species: "Cat",
    age: "Young", gender: "Male", status: "available",
    emoji: "🐱", imageUrl: "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=600&auto=format&fit=crop",
    description: "Leo is a wild-looking Bengal with a spotted coat and an adventurous spirit. He loves to climb, explore, and play fetch.",
    traits: { energy: 10, social: 8, maintenance: 5, suitableFor: { apartment: false, children: true, allergies: false, beginners: false } },
    tags: ["Active", "Playful", "Intelligent"],
  },
  {
    name: "Cleo", breed: "Abyssinian", species: "Cat",
    age: "Young", gender: "Female", status: "available",
    emoji: "🐱", imageUrl: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=600&auto=format&fit=crop",
    description: "Cleo is a sleek and curious Abyssinian who is always on the move. She loves interactive toys and climbing to high places.",
    traits: { energy: 9, social: 7, maintenance: 3, suitableFor: { apartment: true, children: true, allergies: false, beginners: false } },
    tags: ["Curious", "Active", "Playful"],
  },
  {
    name: "Mochi", breed: "Scottish Fold", species: "Cat",
    age: "Kitten", gender: "Male", status: "available",
    emoji: "🐱", imageUrl: "https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=600&auto=format&fit=crop",
    description: "Mochi is an irresistibly cute Scottish Fold kitten with folded ears and big round eyes. He's sweet, playful and loves toys.",
    traits: { energy: 6, social: 8, maintenance: 5, suitableFor: { apartment: true, children: true, allergies: false, beginners: true } },
    tags: ["Playful", "Friendly", "Vaccinated"],
  },
  {
    name: "Willow", breed: "Norwegian Forest Cat", species: "Cat",
    age: "Adult", gender: "Female", status: "available",
    emoji: "🐱", imageUrl: "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=600&auto=format&fit=crop",
    description: "Willow is a majestic Norwegian Forest Cat with a thick double coat and a gentle soul. She loves cozy spots and quiet company.",
    traits: { energy: 5, social: 6, maintenance: 7, suitableFor: { apartment: true, children: true, allergies: false, beginners: true } },
    tags: ["Gentle", "Calm", "Indoor"],
  },
  {
    name: "Shadow", breed: "Bombay", species: "Cat",
    age: "Adult", gender: "Male", status: "available",
    emoji: "🐱", imageUrl: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=600&auto=format&fit=crop",
    description: "Shadow is a sleek all-black Bombay cat with striking copper eyes. He's curious, affectionate and loves being the center of attention.",
    traits: { energy: 6, social: 9, maintenance: 3, suitableFor: { apartment: true, children: true, allergies: false, beginners: true } },
    tags: ["Affectionate", "Friendly", "Vaccinated"],
  },
  {
    name: "Peach", breed: "Devon Rex", species: "Cat",
    age: "Kitten", gender: "Female", status: "available",
    emoji: "🐱", imageUrl: "https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=600&auto=format&fit=crop",
    description: "Peach is a tiny Devon Rex kitten with wavy fur and enormous ears. She's mischievous, playful and absolutely full of personality.",
    traits: { energy: 9, social: 9, maintenance: 3, suitableFor: { apartment: true, children: true, allergies: true, beginners: true } },
    tags: ["Hypoallergenic", "Playful", "Friendly"],
  },
  {
    name: "Ash", breed: "Russian Blue", species: "Cat",
    age: "Adult", gender: "Male", status: "available",
    emoji: "🐱", imageUrl: "https://images.unsplash.com/photo-1576435728678-68d0fbf94946?w=600&auto=format&fit=crop",
    description: "Ash is a reserved but deeply loyal Russian Blue. He takes time to warm up but once he does, he's your shadow for life.",
    traits: { energy: 4, social: 5, maintenance: 3, suitableFor: { apartment: true, children: false, allergies: true, beginners: false } },
    tags: ["Quiet", "Loyal", "Hypoallergenic"],
  },
  {
    name: "Ginger", breed: "Tabby", species: "Cat",
    age: "Senior", gender: "Female", status: "available",
    emoji: "🐱", imageUrl: "https://images.unsplash.com/photo-1611915387288-fd8d2f5f928b?w=600&auto=format&fit=crop",
    description: "Ginger is a sweet senior tabby who has so much love left to give. She's calm, low-maintenance and just wants a warm lap.",
    traits: { energy: 2, social: 7, maintenance: 3, suitableFor: { apartment: true, children: false, allergies: false, beginners: true } },
    tags: ["Calm", "Gentle", "Indoor"],
  },
  {
    name: "Pixel", breed: "Sphynx", species: "Cat",
    age: "Young", gender: "Male", status: "available",
    emoji: "🐱", imageUrl: "https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=600&auto=format&fit=crop",
    description: "Pixel is a hairless Sphynx who makes up for his lack of fur with an enormous personality. He's warm to the touch and loves to cuddle.",
    traits: { energy: 7, social: 10, maintenance: 6, suitableFor: { apartment: true, children: true, allergies: true, beginners: false } },
    tags: ["Hypoallergenic", "Affectionate", "Playful"],
  },
  {
    name: "Hazel", breed: "Birman", species: "Cat",
    age: "Adult", gender: "Female", status: "available",
    emoji: "🐱", imageUrl: "https://images.unsplash.com/photo-1570824104453-508955ab713e?w=600&auto=format&fit=crop",
    description: "Hazel is a beautiful Birman with silky fur and striking blue eyes. She's gentle, sociable and gets along wonderfully with everyone.",
    traits: { energy: 4, social: 8, maintenance: 6, suitableFor: { apartment: true, children: true, allergies: false, beginners: true } },
    tags: ["Gentle", "Friendly", "Vaccinated"],
  },
];

console.log("🌱 Seeding cats...");

for (const cat of cats) {
  const exists = await Pet.findOne({ name: cat.name, breed: cat.breed });
  if (exists) {
    await Pet.findOneAndUpdate({ name: cat.name, breed: cat.breed }, { imageUrl: cat.imageUrl });
    console.log(`🔄 Updated image: ${cat.name} — ${cat.breed}`);
  } else {
    await Pet.create(cat);
    console.log(`✅ Added: ${cat.name} — ${cat.breed}`);
  }
}

console.log("🎉 Done seeding cats!");
mongoose.disconnect();
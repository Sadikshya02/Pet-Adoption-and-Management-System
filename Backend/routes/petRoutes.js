import express from "express";
import Pet from "../models/Pet.js";

const router = express.Router();

// EXISTING ROUTES 

// GET ALL PETS
router.get("/", async (req, res) => {
  try {
    const pets = await Pet.find().sort({ createdAt: -1 });
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pets", error: error.message });
  }
});

// ADD NEW PET
router.post("/", async (req, res) => {
  try {
    const { name, breed } = req.body;
    if (!name || !breed) return res.status(400).json({ message: "Name and breed are required" });

    const emojiMap = { Dog: "🐶", Cat: "🐱", Rabbit: "🐰", Other: "🐾" };
    const pet = new Pet({
      ...req.body,
      emoji: emojiMap[req.body.species] || "🐾",
    });
    await pet.save();
    res.status(201).json(pet);
  } catch (error) {
    res.status(500).json({ message: "Failed to add pet", error: error.message });
  }
});

// UPDATE PET
router.put("/:id", async (req, res) => {
  try {
    const emojiMap = { Dog: "🐶", Cat: "🐱", Rabbit: "🐰", Other: "🐾" };
    const pet = await Pet.findByIdAndUpdate(
      req.params.id,
      { ...req.body, emoji: emojiMap[req.body.species] || "🐾" },
      { new: true }
    );
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    res.json(pet);
  } catch (error) {
    res.status(500).json({ message: "Failed to update pet", error: error.message });
  }
});

// DELETE PET
router.delete("/:id", async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    res.json({ message: "Pet deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete pet", error: error.message });
  }
});

// Get single pet 
router.get("/:id", async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    res.json(pet);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pet", error: error.message });
  }
});

export default router;
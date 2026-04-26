import express from "express";
import Pet from "../models/Pet.js";

const router = express.Router();

// ── YOUR EXISTING ROUTES (unchanged) ──

router.get("/", async (req, res) => {
  try {
    const pets = await Pet.find().sort({ createdAt: -1 });
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pets", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, breed } = req.body;
    if (!name || !breed) return res.status(400).json({ message: "Name and breed are required" });
    const emojiMap = { Dog: "🐶", Cat: "🐱", Rabbit: "🐰", Other: "🐾" };
    const pet = new Pet({ ...req.body, emoji: emojiMap[req.body.species] || "🐾" });
    await pet.save();
    res.status(201).json(pet);
  } catch (error) {
    res.status(500).json({ message: "Failed to add pet", error: error.message });
  }
});

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

router.delete("/:id", async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    res.json({ message: "Pet deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete pet", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    res.json(pet);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pet", error: error.message });
  }
});

// ── NEW ROUTES ──

// PATCH /api/pets/:id/status  — update adoption status only
router.patch("/:id/status", async (req, res) => {
  try {
    const { adoptionStatus } = req.body;
    const valid = ["Available", "Reserved", "Adopted", "Medical Hold"];
    if (!valid.includes(adoptionStatus))
      return res.status(400).json({ message: "Invalid adoption status" });

    const pet = await Pet.findByIdAndUpdate(
      req.params.id,
      { adoptionStatus },
      { new: true }
    );
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    res.json(pet);
  } catch (error) {
    res.status(500).json({ message: "Failed to update status", error: error.message });
  }
});

// GET /api/pets/filter — filter by species, adoptionStatus, size etc.
router.get("/filter/search", async (req, res) => {
  try {
    const { species, adoptionStatus, size, gender, specialNeeds, page = 1, limit = 12 } = req.query;
    const filter = {};
    if (species)        filter.species = species;
    if (adoptionStatus) filter.adoptionStatus = adoptionStatus;
    if (size)           filter.size = size;
    if (gender)         filter.gender = gender;
    if (specialNeeds)   filter.specialNeeds = specialNeeds === "true";

    const skip = (Number(page) - 1) * Number(limit);
    const [pets, total] = await Promise.all([
      Pet.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Pet.countDocuments(filter),
    ]);
    res.json({ pets, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ message: "Failed to filter pets", error: error.message });
  }
});

export default router;
import express from "express";
import SavedPet from "../models/SavedPets.js";
import Pet from "../models/Pet.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "userId required" });

    const saved  = await SavedPet.find({ userId }).sort({ createdAt: -1 });
    const petIds = saved.map(s => s.petId);
    const pets   = await Pet.find({ _id: { $in: petIds } });

    const enriched = saved.map(s => {
      const pet = pets.find(p => p._id.toString() === s.petId.toString());
      return pet ? { ...pet.toObject(), savedId: s._id } : null;
    }).filter(Boolean);

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { userId, petId } = req.body;
    const saved = await SavedPet.create({ userId, petId });
    res.status(201).json(saved);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: "Already saved" });
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await SavedPet.findByIdAndDelete(req.params.id);
    res.json({ message: "Removed from saved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
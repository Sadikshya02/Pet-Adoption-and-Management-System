import express from "express";
import userModel from "../models/userModel.js";

const router = express.Router();

// EXISTING ROUTES

// GET all users
router.get("/", async (req, res) => {
  const users = await userModel.find();
  res.json(users);
});

// DELETE user
router.delete("/:id", async (req, res) => {
  await userModel.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

//  NEW: Save questionnaire traits 
router.post("/:id/questionnaire", async (req, res) => {
  try {
    const { energy, social, maintenance, livingSpace, workSchedule, experience, hasChildren, hasAllergies } = req.body;

    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      {
        traits: { energy, social, maintenance, livingSpace, workSchedule, experience, hasChildren, hasAllergies },
        questionnaireCompleted: true,
      },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Traits saved", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//  Toggle favorite pet 
router.post("/:id/favorites/:petId", async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const alreadyFav = user.favorites.includes(req.params.petId);

    const updated = await userModel.findByIdAndUpdate(
      req.params.id,
      alreadyFav
        ? { $pull:      { favorites: req.params.petId } }
        : { $addToSet:  { favorites: req.params.petId } },
      { new: true }
    ).populate("favorites");

    res.json({ favorites: updated.favorites });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
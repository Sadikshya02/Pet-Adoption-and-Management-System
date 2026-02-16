import express from "express";
import Adoption from "../models/Adoption.js";

const router = express.Router();

// CREATE adoption request
router.post("/", async (req, res) => {
  try {
    const adoption = new Adoption(req.body);
    await adoption.save();

    res.status(201).json({
      message: "Adoption questionnaire submitted successfully",
      adoption,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to submit adoption questionnaire",
      error: error.message,
    });
  }
});

// GET all adoption requests (so you can check them later)
router.get("/", async (req, res) => {
  try {
    const adoptions = await Adoption.find().sort({ createdAt: -1 });
    res.json(adoptions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch adoptions", error: error.message });
  }
});

export default router;

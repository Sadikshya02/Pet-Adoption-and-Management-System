// import express from "express";
// import Pet from "../models/Pet.js";
// import Match from "../models/Match.js";
// import userModel from "../models/userModel.js";

// const router = express.Router();

// //  Weighted matching algorithm 
// // Weights: maintenance×3, energy×2, social×1  |  Max possible score = 54
// // Lower score = better match  |  compatibilityPct: 0–100 (higher = better)
// function calculateMatch(userTraits, petTraits) {
//   const energyDiff      = Math.abs(userTraits.energy      - petTraits.energy);
//   const socialDiff      = Math.abs(userTraits.social      - petTraits.social);
//   const maintenanceDiff = Math.abs(userTraits.maintenance - petTraits.maintenance);

//   const score = energyDiff * 2 + socialDiff * 1 + maintenanceDiff * 3;
//   const MAX_SCORE = 54;
//   const compatibilityPct = Math.round(((MAX_SCORE - score) / MAX_SCORE) * 100);

//   return { score, compatibilityPct, breakdown: { energyDiff, socialDiff, maintenanceDiff } };
// }

// // Apply lifestyle bonuses/penalties based on user lifestyle vs pet suitability
// function applyLifestyleAdjustment(userTraits, petSuitableFor, compatibilityPct) {
//   let adjusted = compatibilityPct;
//   if (userTraits.livingSpace === "apartment" && !petSuitableFor.apartment)  adjusted -= 15;
//   if (userTraits.hasChildren  && !petSuitableFor.children)                  adjusted -= 10;
//   if (userTraits.hasAllergies && !petSuitableFor.allergies)                 adjusted -= 20;
//   if (userTraits.experience === "none" && !petSuitableFor.beginners)        adjusted -= 10;
//   return Math.max(0, Math.min(100, adjusted));
// }

// //  POST /api/matches/run/:userId — run matching for a user 
// router.post("/run/:userId", async (req, res) => {
//   try {
//     const user = await userModel.findById(req.params.userId);
//     if (!user)                        return res.status(404).json({ message: "User not found" });
//     if (!user.questionnaireCompleted) return res.status(400).json({ message: "Complete the questionnaire first" });

//     const pets = await Pet.find({ status: "available" });
//     const results = [];

//     for (const pet of pets) {
//       const { score, compatibilityPct, breakdown } = calculateMatch(user.traits, pet.traits);
//       const adjustedPct = applyLifestyleAdjustment(user.traits, pet.traits.suitableFor, compatibilityPct);

//       const match = await Match.findOneAndUpdate(
//         { user: user._id, pet: pet._id },
//         { score, compatibilityPct: adjustedPct, breakdown },
//         { upsert: true, new: true }
//       ).populate("pet");

//       results.push(match);
//     }

//     results.sort((a, b) => b.compatibilityPct - a.compatibilityPct);
//     res.json(results);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// //  GET /api/matches/:userId — fetch saved matches for a user 
// router.get("/:userId", async (req, res) => {
//   try {
//     const matches = await Match.find({ user: req.params.userId })
//       .populate("pet")
//       .sort({ compatibilityPct: -1 });
//     res.json(matches);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// export default router;


import express from "express";
import Pet from "../models/Pet.js";
import Match from "../models/Match.js";
import userModel from "../models/userModel.js";

const router = express.Router();

function calculateMatch(userTraits, petTraits) {
  const energyDiff      = Math.abs(userTraits.energy      - petTraits.energy);
  const socialDiff      = Math.abs(userTraits.social      - petTraits.social);
  const maintenanceDiff = Math.abs(userTraits.maintenance - petTraits.maintenance);

  const score = energyDiff * 2 + socialDiff * 1 + maintenanceDiff * 3;
  const MAX_SCORE = 54;
  const compatibilityPct = Math.round(((MAX_SCORE - score) / MAX_SCORE) * 100);

  return { score, compatibilityPct, breakdown: { energyDiff, socialDiff, maintenanceDiff } };
}

function applyLifestyleAdjustment(userTraits, petSuitableFor, compatibilityPct) {
  let adjusted = compatibilityPct;
  if (userTraits.livingSpace === "apartment" && !petSuitableFor?.apartment)  adjusted -= 15;
  if (userTraits.hasChildren  && !petSuitableFor?.children)                  adjusted -= 10;
  if (userTraits.hasAllergies && !petSuitableFor?.allergies)                 adjusted -= 20;
  if (userTraits.experience === "none" && !petSuitableFor?.beginners)        adjusted -= 10;
  return Math.max(0, Math.min(100, adjusted));
}

// POST /api/matches/run/:userId
router.post("/run/:userId", async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userId);

    //  debug logs
    console.log("USER FOUND:", user?._id);
    console.log("QUESTIONNAIRE COMPLETED:", user?.questionnaireCompleted);
    console.log("USER TRAITS:", user?.traits);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.questionnaireCompleted) return res.status(400).json({ message: "Complete the questionnaire first" });

    const pets = await Pet.find({ status: "available" });
    console.log("PETS FOUND:", pets.length);

    const results = [];

    for (const pet of pets) {
      console.log("PET TRAITS:", pet.name, pet.traits);

      const { score, compatibilityPct, breakdown } = calculateMatch(user.traits, pet.traits);
      const adjustedPct = applyLifestyleAdjustment(user.traits, pet.traits?.suitableFor, compatibilityPct);

      console.log(`MATCH ${pet.name}: score=${score} pct=${adjustedPct}`);

      const match = await Match.findOneAndUpdate(
        { user: user._id, pet: pet._id },
        { score, compatibilityPct: adjustedPct, breakdown },
        { upsert: true, returnDocument: "after" }
      ).populate("pet");

      results.push(match);
    }

    results.sort((a, b) => b.compatibilityPct - a.compatibilityPct);
    console.log("TOTAL MATCHES SAVED:", results.length);
    res.json(results);
  } catch (err) {
    console.error("MATCH ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/matches/:userId
router.get("/:userId", async (req, res) => {
  try {
    const matches = await Match.find({ user: req.params.userId })
      .populate("pet")
      .sort({ compatibilityPct: -1 });

    console.log("FETCHED MATCHES:", matches.length);
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
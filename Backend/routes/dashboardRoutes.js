import express from "express";
import Adoption from "../models/Adoption.js";
import Pet from "../models/Pet.js";
import userModel from "../models/userModel.js";

const router = express.Router();

// GET /api/dashboard  — used by admin dashboard
router.get("/", async (req, res) => {
  try {
    const [totalRequests, approved, pending, rejected, totalUsers, totalPets] = await Promise.all([
      Adoption.countDocuments(),
      Adoption.countDocuments({ status: "approved" }),
      Adoption.countDocuments({ status: "pending" }),
      Adoption.countDocuments({ status: "rejected" }),
      userModel.countDocuments({ role: "user" }),
      Pet.countDocuments(),
    ]);

    // Adoption trends grouped by month
    const adoptionTrends = await Adoption.aggregate([
      { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // Pet categories (species breakdown)
    const petCategories = await Pet.aggregate([
      { $group: { _id: "$species", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      stats: { totalRequests, approved, pending, rejected, totalUsers, totalPets },
      adoptionTrends,
      petCategories,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
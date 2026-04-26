import express from "express";
import Adoption from "../models/Adoption.js";
import Pet from "../models/Pet.js";
import userModel from "../models/userModel.js";

const router = express.Router();

// GET /api/reports
router.get("/", async (req, res) => {
  try {
    const [totalAdoptions, approved, pending, rejected, totalPets, totalUsers] = await Promise.all([
      Adoption.countDocuments(),
      Adoption.countDocuments({ status: "approved" }),
      Adoption.countDocuments({ status: "pending" }),
      Adoption.countDocuments({ status: "rejected" }),
      Pet.countDocuments(),
      userModel.countDocuments({ role: "user" }),
    ]);

    // Monthly adoption trends
    const rawTrends = await Adoption.aggregate([
      { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const adoptionTrends = rawTrends.map(t => ({ month: monthNames[t._id - 1], count: t.count }));

    // Request status breakdown
    const requestStatus = { Approved: approved, Pending: pending, Rejected: rejected };

    // Top adopted breeds
    const breedAgg = await Adoption.aggregate([
      { $match: { status: "approved" } },
      { $group: { _id: "$petName", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const rateClass = (count) => {
      if (count >= 5) return { cls: "bg-green-100 text-green-700", rate: "High" };
      if (count >= 2) return { cls: "bg-yellow-100 text-yellow-700", rate: "Medium" };
      return { cls: "bg-red-100 text-red-700", rate: "Low" };
    };

    const topBreeds = breedAgg.map((b, i) => {
      const { cls, rate } = rateClass(b.count);
      return { rank: i + 1, breed: b._id, type: "—", count: b.count, cls, rate };
    });

    // Metrics cards
    const metrics = [
      { label: "Total Adoptions", value: totalAdoptions },
      { label: "Approved",        value: approved },
      { label: "Pending",         value: pending },
      { label: "Total Pets",      value: totalPets },
    ];

    res.json({ adoptionTrends, requestStatus, metrics, topBreeds });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
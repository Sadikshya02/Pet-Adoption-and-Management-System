import express from "express";
import Shelter from "../models/Shelter.js";
import ShelterNotification from "../models/ShelterNotification.js";
import {
  sendShelterApprovedEmail,
  sendShelterRejectedEmail,
} from "../utils/shelterEmail.js";

const router = express.Router();

// GET /api/admin/shelters
router.get("/", async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status
      ? { status: { $regex: new RegExp(`^${status}$`, "i") } }
      : {};
    const shelters = await Shelter.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: shelters });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/shelters/:id
router.get("/:id", async (req, res) => {
  try {
    const shelter = await Shelter.findById(req.params.id);
    if (!shelter) return res.status(404).json({ message: "Shelter not found" });
    res.json({ success: true, data: shelter });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/admin/shelters/:id/approve
router.patch("/:id/approve", async (req, res) => {
  try {
    const shelter = await Shelter.findByIdAndUpdate(
      req.params.id,
      { status: "Approved", approvedAt: new Date(), rejectionReason: "" },
      { new: true }
    );
    if (!shelter) return res.status(404).json({ message: "Shelter not found" });

    // Send approval email
    try { await sendShelterApprovedEmail(shelter); } catch (e) { console.error("Email error:", e.message); }

    // Create in-app notification
    await ShelterNotification.create({
      shelterId: shelter._id,
      type:      "approval",
      title:     "Your shelter has been approved! 🎉",
      message:   "You can now log in and start managing your shelter on FureverHome.",
      link:      "/shelter/dashboard",
    });

    res.json({ success: true, data: shelter });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/admin/shelters/:id/reject
router.patch("/:id/reject", async (req, res) => {
  try {
    const { reason } = req.body;
    const shelter = await Shelter.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected", rejectionReason: reason || "Did not meet requirements" },
      { new: true }
    );
    if (!shelter) return res.status(404).json({ message: "Shelter not found" });

    // Send rejection email
    try { await sendShelterRejectedEmail(shelter, reason); } catch (e) { console.error("Email error:", e.message); }

    // Create in-app notification
    await ShelterNotification.create({
      shelterId: shelter._id,
      type:      "rejection",
      title:     "Registration update",
      message:   `Your shelter registration was not approved. Reason: ${reason || "Did not meet requirements"}`,
      link:      "",
    });

    res.json({ success: true, data: shelter });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/shelters/:id
router.delete("/:id", async (req, res) => {
  try {
    await Shelter.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Shelter deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
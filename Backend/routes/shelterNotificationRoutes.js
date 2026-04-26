import express from "express";
import ShelterNotification from "../models/ShelterNotification.js";
import { protectShelter } from "../middleware/shelterAuth.js";

const router = express.Router();

// GET /api/shelter-notifications — get all for this shelter
router.get("/", protectShelter, async (req, res) => {
  try {
    const notifications = await ShelterNotification.find({ shelterId: req.shelter._id })
      .sort({ createdAt: -1 })
      .limit(20);
    const unreadCount = await ShelterNotification.countDocuments({
      shelterId: req.shelter._id,
      isRead: false,
    });
    res.json({ success: true, data: notifications, unreadCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/shelter-notifications/:id/read — mark one as read
router.patch("/:id/read", protectShelter, async (req, res) => {
  try {
    await ShelterNotification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/shelter-notifications/read-all — mark all as read
router.patch("/read-all", protectShelter, async (req, res) => {
  try {
    await ShelterNotification.updateMany(
      { shelterId: req.shelter._id, isRead: false },
      { isRead: true }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
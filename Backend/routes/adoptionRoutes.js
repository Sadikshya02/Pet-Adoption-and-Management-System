import express from "express";
import Adoption from "../models/Adoption.js";
import Notification from "../models/Notification.js";

const router = express.Router();

//  CREATE ADOPTION REQUEST 
router.post("/", async (req, res) => {
  try {
    const { petId, petName } = req.body;

    if (!petId || !petName) {
      return res.status(400).json({
        message: "petId and petName are required",
      });
    }

    const adoption = new Adoption({
      ...req.body,
      status: "pending",
    });

    await adoption.save();

    res.status(201).json({
      message: "Adoption questionnaire submitted successfully",
      adoption,
    });
  } catch (error) {
    console.error("Error creating adoption:", error.message);
    res.status(500).json({
      message: "Failed to submit adoption questionnaire",
      error: error.message,
    });
  }
});

//  GET ALL ADOPTION REQUESTS 
router.get("/", async (req, res) => {
  try {
    const adoptions = await Adoption.find().sort({ createdAt: -1 });
    res.json(adoptions);
  } catch (error) {
    console.error("Fetch error:", error.message);
    res.status(500).json({
      message: "Failed to fetch adoptions",
      error: error.message,
    });
  }
});

//  UPDATE STATUS 
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updated = await Adoption.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Adoption request not found" });
    }

    // Create notification for the user 
    // Only fire if the adoption has a userId saved on it
    if (updated.userId) {
      const notifMap = {
        approved: {
          title:   "Application Approved! 🎉",
          message: `Congratulations! Your adoption application for ${updated.petName} has been approved. The shelter will contact you soon.`,
        },
        rejected: {
          title:   "Application Update",
          message: `Thank you for your interest in ${updated.petName}. Unfortunately your application was not approved this time.`,
        },
        pending: {
          title:   "Application Submitted",
          message: `Your adoption application for ${updated.petName} has been received and is under review.`,
        },
      };

      const notifData = notifMap[status];
      if (notifData) {
        try {
          await Notification.create({
            userId:     updated.userId,
            type:       "status",
            title:      notifData.title,
            message:    notifData.message,
            adoptionId: updated._id,
            petId:      updated.petId,
          });
        } catch (notifErr) {
          // Don't fail the whole request if notification fails
          console.error("Notification create error:", notifErr.message);
        }
      }
    }
    

    res.json({
      message: "Status updated successfully",
      adoption: updated,
    });
  } catch (error) {
    console.error("Error updating status:", error.message);
    res.status(500).json({
      message: "Failed to update status",
      error: error.message,
    });
  }
});

export default router;
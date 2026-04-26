import mongoose from "mongoose";

const shelterNotificationSchema = new mongoose.Schema(
  {
    shelterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shelter",
      required: true,
    },
    type: {
      type: String,
      enum: ["application", "approval", "rejection", "general"],
      required: true,
    },
    title:   { type: String, required: true },
    message: { type: String, required: true },
    isRead:  { type: Boolean, default: false },
    link:    { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("ShelterNotification", shelterNotificationSchema);
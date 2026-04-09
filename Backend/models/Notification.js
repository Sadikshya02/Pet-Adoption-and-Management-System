import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId:     { type: mongoose.Schema.Types.ObjectId, ref: "User",     required: true },
    type:       { type: String, enum: ["status", "match", "message"],    required: true },
    title:      { type: String, required: true },
    message:    { type: String, required: true },
    read:       { type: Boolean, default: false },
    petId:      { type: mongoose.Schema.Types.ObjectId, ref: "Pet",      default: null },
    adoptionId: { type: mongoose.Schema.Types.ObjectId, ref: "Adoption", default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
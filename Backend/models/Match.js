import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    pet:  { type: mongoose.Schema.Types.ObjectId, ref: "Pet",  required: true },
    score:            { type: Number, required: true },
    compatibilityPct: { type: Number, required: true },
    breakdown: {
      energyDiff:      Number,
      socialDiff:      Number,
      maintenanceDiff: Number,
    },
  },
  { timestamps: true }
);

// One record per user-pet pair
matchSchema.index({ user: 1, pet: 1 }, { unique: true });

export default mongoose.model("Match", matchSchema);
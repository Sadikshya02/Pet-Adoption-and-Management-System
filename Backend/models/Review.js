import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId:     { type: mongoose.Schema.Types.ObjectId, ref: "User",     required: true },
    petId:      { type: mongoose.Schema.Types.ObjectId, ref: "Pet",      required: true },
    adoptionId: { type: mongoose.Schema.Types.ObjectId, ref: "Adoption", required: true },
    shelter:    { type: String, required: true },
    rating:     { type: Number, min: 1, max: 5, required: true },
    text:       { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
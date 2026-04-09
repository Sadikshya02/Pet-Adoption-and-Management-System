import mongoose from "mongoose";

const savedPetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    petId:  { type: mongoose.Schema.Types.ObjectId, ref: "Pet",  required: true },
  },
  { timestamps: true }
);

savedPetSchema.index({ userId: 1, petId: 1 }, { unique: true });

export default mongoose.model("SavedPet", savedPetSchema);
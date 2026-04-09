import mongoose from "mongoose";

const adoptionSchema = new mongoose.Schema(
  {
    petId:   { type: String, required: true },
    petName: { type: String, required: true },
    name:    { type: String, required: true },
    email:   { type: String, required: true },
    phone:   { type: String, default: "" },
    note:    { type: String, default: "" },
    status:  { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    userId:  { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, 
  },
  { timestamps: true }
);

export default mongoose.model("Adoption", adoptionSchema);
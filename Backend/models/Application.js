// models/Application.js
import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
  petId: Number,           // the pet's ID
  userId: String,          // user who applied
  name: String,
  email: String,
  status: { type: String, default: "Pending" },
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Application", ApplicationSchema);
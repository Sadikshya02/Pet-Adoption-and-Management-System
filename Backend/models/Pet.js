import mongoose from "mongoose";

const petSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true },
    breed:       { type: String, required: true },
    species:     { type: String, required: true, default: "Dog" },
    age:         { type: String, default: "" },
    gender:      { type: String, default: "Male" },
    status:      { type: String, enum: ["available", "review", "adopted"], default: "available" },
    description: { type: String, default: "" },
    emoji:       { type: String, default: "🐾" },
    imageUrl:    { type: String, default: "" }, 
    savedByUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    traits: {
      energy:      { type: Number, min: 1, max: 10, default: 5 },
      social:      { type: Number, min: 1, max: 10, default: 5 },
      maintenance: { type: Number, min: 1, max: 10, default: 5 },
      suitableFor: {
        apartment: { type: Boolean, default: true },
        children:  { type: Boolean, default: true },
        allergies: { type: Boolean, default: false },
        beginners: { type: Boolean, default: true },
      },
    },
    tags: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Pet", petSchema);
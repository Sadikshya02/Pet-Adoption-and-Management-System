import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name:     { type: String },
  email:    { type: String, unique: true, sparse: true },
  password: { type: String },
  role:     { type: String, default: "user", enum: ["user", "shelter", "admin"] },
  address:  { type: String },

  // sparse: true allows multiple documents with null phoneNumber
  phoneNumber: {
    type:   String,
    unique: true,
    sparse: true,
  },

  isAccountVerified: { type: Boolean, default: false },

  // Pet matching fields
  traits: {
    energy:       { type: Number, min: 1, max: 10 },
    social:       { type: Number, min: 1, max: 10 },
    maintenance:  { type: Number, min: 1, max: 10 },
    livingSpace:  { type: String, enum: ["apartment", "house_small", "house_large"] },
    workSchedule: { type: String, enum: ["home", "parttime", "fulltime"] },
    experience:   { type: String, enum: ["none", "some", "experienced"] },
    hasChildren:  { type: Boolean, default: false },
    hasAllergies: { type: Boolean, default: false },
  },
  questionnaireCompleted: { type: Boolean, default: false },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pet" }],
});

export default mongoose.model("User", userSchema);
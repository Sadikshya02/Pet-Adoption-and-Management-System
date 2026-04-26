import mongoose from "mongoose";

const photoSchema = new mongoose.Schema({
  url:       { type: String, required: true },
  caption:   { type: String, default: "" },
  isPrimary: { type: Boolean, default: false },
});

const shelterSchema = new mongoose.Schema({
  name:           { type: String },
  address:        { type: String },
  city:           { type: String },
  state:          { type: String },
  zipCode:        { type: String },
  phone:          { type: String },
  email:          { type: String },
  website:        { type: String },
  operatingHours: { type: String },
  logo:           { type: String },
});

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

    // ✅ shelterId at top level
    shelterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shelter",
      default: null,
    },

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

    color:  { type: String, default: "" },
    size:   { type: String, enum: ["Tiny", "Small", "Medium", "Large", "Extra Large"], default: "Medium" },
    weight: { type: Number },

    vaccinationStatus: {
      type: String,
      enum: ["Up to Date", "Partially Vaccinated", "Not Vaccinated", "Unknown"],
      default: "Unknown",
    },
    isNeuteredOrSpayed:      { type: Boolean, default: false },
    isMicrochipped:          { type: Boolean, default: false },
    isHouseTrained:          { type: Boolean, default: false },
    medicalNotes:            { type: String, default: "" },
    specialNeeds:            { type: Boolean, default: false },
    specialNeedsDescription: { type: String, default: "" },

    temperament: [{ type: String }],
    compatibleWithChildren: {
      type: String,
      enum: ["Yes", "No", "Older Children Only", "Unknown"],
      default: "Unknown",
    },
    compatibleWithDogs: {
      type: String,
      enum: ["Yes", "No", "With Introduction", "Unknown"],
      default: "Unknown",
    },
    compatibleWithCats: {
      type: String,
      enum: ["Yes", "No", "With Introduction", "Unknown"],
      default: "Unknown",
    },
    energyLevel: {
      type: String,
      enum: ["Low", "Moderate", "High", "Very High"],
      default: "Moderate",
    },

    adoptionStatus: {
      type: String,
      enum: ["Available", "Reserved", "Adopted", "Medical Hold"],
      default: "Available",
    },
    adoptionFee:  { type: Number, default: 0 },
    rescueDate:   { type: Date },
    profileStory: { type: String, default: "" },

    photos:   [photoSchema],
    videoUrl: { type: String, default: "" },

    shelter: shelterSchema,
  },
  { timestamps: true }
);

export default mongoose.model("Pet", petSchema);
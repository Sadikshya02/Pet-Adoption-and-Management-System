import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const shelterSchema = new mongoose.Schema(
  {
    organizationName:   { type: String, required: true, trim: true },
    registrationNumber: { type: String, required: true, trim: true },
    contactPerson:      { type: String, required: true },
    email:              { type: String, required: true, unique: true, lowercase: true },
    phone:              { type: String, required: true },
    district:           { type: String, required: true },
    province:           { type: String, required: true },
    fullAddress:        { type: String, required: true },
    website:            { type: String, default: "" },
    socialLinks: {
      facebook:  { type: String, default: "" },
      instagram: { type: String, default: "" },
      twitter:   { type: String, default: "" },
    },
    description:  { type: String, default: "" },
    capacity:     { type: Number, default: 0 },
    animalTypes:  [{ type: String }],

    // ✅ No defaults — only stored when coordinates are actually provided
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number], // [lng, lat]
      },
    },

    logo: { type: String, default: "" },

    documents: {
      registrationCertificate: { type: String, default: "" },
      taxDocument:              { type: String, default: "" },
      ownerIdProof:             { type: String, default: "" },
    },

    password: { type: String, required: true, select: false },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    rejectionReason: { type: String, default: "" },
    approvedAt:      { type: Date },

    shelterStatus: {
      type: String,
      enum: ["accepting_adoptions", "by_appointment", "intake_full", "closed"],
      default: "accepting_adoptions",
    },

    petCounts: {
      dogs: { type: Number, default: 0 },
      cats: { type: Number, default: 0 },
    },

    volunteerUrl: { type: String, default: "" },
    donateUrl:    { type: String, default: "" },
  },
  { timestamps: true }
);

shelterSchema.index({ location: "2dsphere" }, { sparse: true }); // ✅ sparse — skips docs with no location
shelterSchema.index({ status: 1, shelterStatus: 1 });

shelterSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

shelterSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

export default mongoose.model("Shelter", shelterSchema);
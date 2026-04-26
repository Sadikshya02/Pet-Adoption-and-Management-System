import mongoose from "mongoose";

const petTipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  short_summary: {
    type: String,
    required: true,
  },
  full_content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Grooming", "Feeding and Nutrition", "Vaccination", "Health and Illness",
      "Training and Behavior", "Puppy Care", "Kitten Care", "Senior Pet Care",
      "Rescue and Rehabilitation", "Adoption Preparation", "Travel With Pets",
      "Emergency or First Aid"
    ],
  },
  pet_type: {
    type: String,
    required: true,
    enum: ["Dog", "Cat", "All"],
    default: "All",
  },
  age_group: {
    type: String,
    required: true,
    enum: ["Puppy/Kitten", "Adult", "Senior", "All"],
    default: "All",
  },
  difficulty_level: {
    type: String,
    required: true,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Beginner",
  },
  featured_image: {
    type: String,
    default: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  tags: {
    type: [String],
    default: [],
  },
  author_information: {
    type: String,
    default: "FureverHome Expert",
  },
  publish_status: {
    type: String,
    enum: ["Draft", "Published"],
    default: "Published",
  },
  // ✅ Save/Bookmark feature
  savedBy: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
}, { timestamps: true });

const PetTip = mongoose.model("PetTip", petTipSchema);
export default PetTip;
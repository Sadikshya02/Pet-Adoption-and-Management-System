import mongoose from "mongoose";

const PetSchema = new mongoose.Schema({
  type: String,
  breed: String,
  age: String,
  gender: String,
  desexed: String,
  duration: String,
});

const AdoptionSchema = new mongoose.Schema(
  {
    date: String,
    name: String,
    surname: String,
    address: String,
    suburb: String,
    postcode: String,
    telephone: String,
    mobile: String,
    email: String,
    council: String,

    animalType: String,

    familyFor: String,
    primaryCaregiver: String,
    childrenCount: String,
    childrenAges: String,
    allergies: String,

    homeType: String,
    ownRent: String,
    peopleCount: String,
    dayLocation: String,
    fenceDescription: String,
    nightLocation: String,
    socialTime: String,
    aloneHours: String,

    currentPets: [PetSchema],
    previousPets: [PetSchema],

    hearAbout: String,
    hearAboutOther: String,

    adopterName: String,
    adopterSignature: String,

    status: {
      type: String,
      default: "Pending", // important for adoption tracking
    },
  },
  { timestamps: true }
);

export default mongoose.model("Adoption", AdoptionSchema);

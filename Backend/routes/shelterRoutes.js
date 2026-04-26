import express from "express";
import Shelter from "../models/Shelter.js";
import Pet from "../models/Pet.js";
import { protectShelter } from "../middleware/shelterAuth.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// ── Multer setup for local storage ──
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/shelters";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

const petStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/pets";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const uploadPetPhotos = multer({ storage: petStorage });

// ── GET /api/shelters/profile ──
router.get("/profile", protectShelter, async (req, res) => {
  try {
    const shelter = await Shelter.findById(req.shelter._id);
    res.json({ success: true, data: shelter });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/shelters/profile ──
router.put("/profile", protectShelter, async (req, res) => {
  try {
    const updated = await Shelter.findByIdAndUpdate(
      req.shelter._id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── POST /api/shelters/upload-logo ──
router.post("/upload-logo", protectShelter, upload.single("logo"), async (req, res) => {
  try {
    const logoUrl = `${req.protocol}://${req.get("host")}/uploads/shelters/${req.file.filename}`;
    await Shelter.findByIdAndUpdate(req.shelter._id, { logo: logoUrl });
    res.json({ success: true, url: logoUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/shelters/pets ──
router.get("/pets", protectShelter, async (req, res) => {
  try {
    const pets = await Pet.find({ shelterId: req.shelter._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: pets });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/shelters/pets ──
router.post("/pets", protectShelter, async (req, res) => {
  try {
    const emojiMap = { Dog: "🐶", Cat: "🐱", Rabbit: "🐰", Other: "🐾" };
    const pet = await Pet.create({
      ...req.body,
      shelterId: req.shelter._id,
      emoji: emojiMap[req.body.species] || "🐾",
      shelter: {
        name:           req.shelter.organizationName,
        address:        req.shelter.fullAddress,
        city:           req.shelter.district,
        state:          req.shelter.province,
        phone:          req.shelter.phone,
        email:          req.shelter.email,
        website:        req.shelter.website,
        operatingHours: req.body.operatingHours || "",
        logo:           req.shelter.logo,
      },
    });

    // ── update live dog/cat counts on the map ──
    const [dogs, cats] = await Promise.all([
      Pet.countDocuments({ shelterId: req.shelter._id, species: "Dog", adoptionStatus: "Available" }),
      Pet.countDocuments({ shelterId: req.shelter._id, species: "Cat", adoptionStatus: "Available" }),
    ]);
    await Shelter.findByIdAndUpdate(req.shelter._id, {
      "petCounts.dogs": dogs,
      "petCounts.cats": cats,
    });
    const io = req.app.get("io");
    if (io) io.emit("shelter:petsUpdated", {
      _id: req.shelter._id,
      petCounts: { dogs, cats },
    });

    res.status(201).json({ success: true, data: pet });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── PUT /api/shelters/pets/:id ──
router.put("/pets/:id", protectShelter, async (req, res) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.id, shelterId: req.shelter._id });
    if (!pet) return res.status(404).json({ message: "Pet not found or not yours" });

    const updated = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // if adoptionStatus changed, recount and push to map
    if (req.body.adoptionStatus) {
      const [dogs, cats] = await Promise.all([
        Pet.countDocuments({ shelterId: req.shelter._id, species: "Dog", adoptionStatus: "Available" }),
        Pet.countDocuments({ shelterId: req.shelter._id, species: "Cat", adoptionStatus: "Available" }),
      ]);
      await Shelter.findByIdAndUpdate(req.shelter._id, {
        "petCounts.dogs": dogs,
        "petCounts.cats": cats,
      });
      const io = req.app.get("io");
      if (io) io.emit("shelter:petsUpdated", {
        _id: req.shelter._id,
        petCounts: { dogs, cats },
      });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── DELETE /api/shelters/pets/:id ──
router.delete("/pets/:id", protectShelter, async (req, res) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.id, shelterId: req.shelter._id });
    if (!pet) return res.status(404).json({ message: "Pet not found or not yours" });

    await Pet.findByIdAndDelete(req.params.id);

    // recount and push to map
    const [dogs, cats] = await Promise.all([
      Pet.countDocuments({ shelterId: req.shelter._id, species: "Dog", adoptionStatus: "Available" }),
      Pet.countDocuments({ shelterId: req.shelter._id, species: "Cat", adoptionStatus: "Available" }),
    ]);
    await Shelter.findByIdAndUpdate(req.shelter._id, {
      "petCounts.dogs": dogs,
      "petCounts.cats": cats,
    });
    const io = req.app.get("io");
    if (io) io.emit("shelter:petsUpdated", {
      _id: req.shelter._id,
      petCounts: { dogs, cats },
    });

    res.json({ success: true, message: "Pet deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/shelters/pets/:id/photos ──
router.post("/pets/:id/photos", protectShelter, uploadPetPhotos.array("photos", 10), async (req, res) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.id, shelterId: req.shelter._id });
    if (!pet) return res.status(404).json({ message: "Pet not found or not yours" });

    const newPhotos = req.files.map((f, i) => ({
      url: `${req.protocol}://${req.get("host")}/uploads/pets/${f.filename}`,
      caption: req.body.captions?.[i] || "",
      isPrimary: i === 0 && pet.photos.length === 0,
    }));

    pet.photos.push(...newPhotos);
    await pet.save();
    res.json({ success: true, data: pet.photos });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/shelters/stats ──
router.get("/stats", protectShelter, async (req, res) => {
  try {
    const [total, available, adopted, medicalHold] = await Promise.all([
      Pet.countDocuments({ shelterId: req.shelter._id }),
      Pet.countDocuments({ shelterId: req.shelter._id, adoptionStatus: "Available" }),
      Pet.countDocuments({ shelterId: req.shelter._id, adoptionStatus: "Adopted" }),
      Pet.countDocuments({ shelterId: req.shelter._id, adoptionStatus: "Medical Hold" }),
    ]);
    res.json({ success: true, data: { total, available, adopted, medicalHold } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/shelters/map ── (public — all approved shelters for the map)
router.get("/map", async (req, res) => {
  try {
    const shelters = await Shelter.find({
      status: "Approved",
      "location.coordinates": { $exists: true, $ne: [] },
    })
      .select("organizationName fullAddress district province phone website logo shelterStatus petCounts volunteerUrl donateUrl location")
      .lean();
    res.json({ success: true, shelters });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PATCH /api/shelters/shelter-status ── (shelter updates its own operational status)
router.patch("/shelter-status", protectShelter, async (req, res) => {
  try {
    const shelter = await Shelter.findByIdAndUpdate(
      req.shelter._id,
      { shelterStatus: req.body.shelterStatus },
      { new: true, runValidators: true }
    );
    const io = req.app.get("io");
    if (io) io.emit("shelter:statusChanged", {
      _id: shelter._id,
      shelterStatus: shelter.shelterStatus,
    });
    res.json({ success: true, shelter });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

export default router;
import express from "express";
import jwt from "jsonwebtoken";
import Shelter from "../models/Shelter.js";
import { protectShelter } from "../middleware/shelterAuth.js";
import multer from "multer";
import fs from "fs";

const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const docStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/documents";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const uploadDocs = multer({ storage: docStorage });

// ── POST /api/shelter-auth/register ─────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const body = { ...req.body };

    // ✅ only build location if valid lat/lng provided
    if (body.location?.lat && body.location?.lng) {
      const lat = parseFloat(body.location.lat);
      const lng = parseFloat(body.location.lng);
      if (!isNaN(lat) && !isNaN(lng)) {
        body.location = {
          type: "Point",
          coordinates: [lng, lat],
        };
      } else {
        delete body.location;
      }
    } else {
      delete body.location;
    }

    const existing = await Shelter.findOne({ email: body.email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const shelter = await Shelter.create(body);
    const token   = signToken(shelter._id);

    // ✅ set cookie so protectShelter can read it
    res.cookie("shelterToken", token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge:   7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "Registration submitted. Awaiting admin approval.",
      token,
      shelter: {
        _id:              shelter._id,
        organizationName: shelter.organizationName,
        email:            shelter.email,
        status:           shelter.status,
        shelterStatus:    shelter.shelterStatus,
        logo:             shelter.logo,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ── POST /api/shelter-auth/login ─────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const shelter = await Shelter.findOne({ email }).select("+password");
    if (!shelter || !(await shelter.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (shelter.status === "Rejected") {
      return res.status(403).json({
        success: false,
        message: "Your application was rejected",
      });
    }

    if (shelter.status === "Pending") {
      return res.status(403).json({
        success: false,
        message: "Your account is pending admin approval",
      });
    }

    const token = signToken(shelter._id);

    // ✅ set cookie — this is what protectShelter reads
    res.cookie("shelterToken", token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge:   7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      shelter: {
        _id:              shelter._id,
        organizationName: shelter.organizationName,
        email:            shelter.email,
        district:         shelter.district,
        province:         shelter.province,
        phone:            shelter.phone,
        website:          shelter.website,
        status:           shelter.status,
        shelterStatus:    shelter.shelterStatus,
        petCounts:        shelter.petCounts,
        logo:             shelter.logo,
        volunteerUrl:     shelter.volunteerUrl,
        donateUrl:        shelter.donateUrl,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/shelter-auth/me ──────────────────────────────────────────────────
router.get("/me", protectShelter, async (req, res) => {
  try {
    const shelter = await Shelter.findById(req.shelter._id);
    if (!shelter) {
      return res.status(404).json({ success: false, message: "Shelter not found" });
    }
    res.json({ success: true, shelter });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/shelter-auth/upload-documents/:id ───────────────────────────────
router.post(
  "/upload-documents/:id",
  uploadDocs.fields([
    { name: "registrationCertificate", maxCount: 1 },
    { name: "taxDocument",             maxCount: 1 },
    { name: "ownerIdProof",            maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const updates = {};
      const base    = `${req.protocol}://${req.get("host")}/uploads/documents`;

      if (req.files?.registrationCertificate)
        updates["documents.registrationCertificate"] =
          `${base}/${req.files.registrationCertificate[0].filename}`;
      if (req.files?.taxDocument)
        updates["documents.taxDocument"] =
          `${base}/${req.files.taxDocument[0].filename}`;
      if (req.files?.ownerIdProof)
        updates["documents.ownerIdProof"] =
          `${base}/${req.files.ownerIdProof[0].filename}`;

      await Shelter.findByIdAndUpdate(req.params.id, { $set: updates });

      res.json({ success: true, message: "Documents uploaded" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// ── POST /api/shelter-auth/logout ─────────────────────────────────────────────
router.post("/logout", (req, res) => {
  res.clearCookie("shelterToken");
  res.json({ success: true, message: "Logged out" });
});

export default router;
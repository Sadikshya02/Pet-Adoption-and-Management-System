import jwt from "jsonwebtoken";
import Shelter from "../models/Shelter.js";

export const protectShelter = async (req, res, next) => {
  try {
    const token = req.cookies.shelterToken;
    if (!token) return res.status(401).json({ message: "Not authorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const shelter = await Shelter.findById(decoded.id);

    if (!shelter) return res.status(401).json({ message: "Shelter not found" });
    if (shelter.status !== "Approved")
      return res.status(403).json({ message: "Shelter not approved yet" });

    req.shelter = shelter;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalid" });
  }
};
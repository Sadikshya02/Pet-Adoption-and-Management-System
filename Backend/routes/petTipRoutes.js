import express from "express";
import {
  getPetTips,
  getPetTipById,
  createPetTip,
  updatePetTip,
  deletePetTip,
  toggleSaveTip,
  getFeaturedTips
} from "../controllers/petTipController.js";

const router = express.Router();

router.get("/featured", getFeaturedTips);

router.route("/")
  .get(getPetTips)
  .post(createPetTip);

router.route("/:id")
  .get(getPetTipById)
  .put(updatePetTip)
  .delete(deletePetTip);

router.put("/:id/save", toggleSaveTip);

export default router;
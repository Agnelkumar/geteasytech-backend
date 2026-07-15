import express from "express";

import {
  createPitchingPoint,
  getPitchingPoints,
  getPitchingPointById,
  updatePitchingPoint,
  deletePitchingPoint,
} from "../controllers/PitchingPointController.js";

const router = express.Router();

router.post("/", createPitchingPoint);

router.get("/", getPitchingPoints);

router.get("/:id", getPitchingPointById);

router.put("/:id", updatePitchingPoint);

router.delete("/:id", deletePitchingPoint);

export default router;
import express from "express";

import {
  createPitchingPoint,
  getPitchingPoints,
  getPitchingPointById,
  recordPitchingPointView,
  getPitchViewAnalytics,
  getMyPitchViewSummary,
  updatePitchingPoint,
  deletePitchingPoint,
} from "../controllers/PitchingPointController.js";
import { masterAdminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, masterAdminOnly, createPitchingPoint);

router.get("/", getPitchingPoints);

router.get("/analytics/views", protect, masterAdminOnly, getPitchViewAnalytics);
router.get("/analytics/my-summary", protect, getMyPitchViewSummary);
router.get("/:id", getPitchingPointById);
router.post("/:id/view", protect, recordPitchingPointView);

router.put("/:id", protect, masterAdminOnly, updatePitchingPoint);

router.delete("/:id", protect, masterAdminOnly, deletePitchingPoint);

export default router;

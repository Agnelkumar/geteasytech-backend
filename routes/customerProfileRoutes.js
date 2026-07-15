import express from "express";
import { createCustomerProfile, getCustomerProfiles } from "../controllers/customerProfileController.js";
import { masterAdminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", getCustomerProfiles);
router.post("/", protect, masterAdminOnly, createCustomerProfile);

export default router;

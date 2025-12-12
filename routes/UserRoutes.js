import express from "express";
import {
  registerMasterAdmin, bulkCreateUsers, downloadTemplate,
  registerUser,
  loginUser,
  getAllUsersByState, changePassword, getAllUsers, getFilteredUsers, createStateAdmin,
  getStateAdmins, deleteUser, findUser, bulkDeleteUsers,
  downloadDeleteTemplate, exportUsers, 
} from "../controllers/userController.js";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";


const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post("/bulk-create", upload.single("file"), bulkCreateUsers);

// ----- MASTER ADMIN -----
router.post("/create-register-master", registerMasterAdmin);

// ----- NORMAL USERS (Created by State Admins) -----
router.post("/register", registerUser);

// ----- LOGIN -----
router.post("/login", loginUser);

// ----- USER LIST (State Admin can view) -----
router.get("/users-by-state", getAllUsersByState);

//router.post("/bulk-create", bulkCreateUsers);
router.get("/csv", downloadTemplate);

router.put("/change-password", changePassword);

router.get("/all", getAllUsers);

router.get("/filtered-users", getFilteredUsers);

router.post("/create-state-admin", createStateAdmin);
router.get("/state-admins", getStateAdmins);

// ------------------ USER MANAGEMENT ------------------
router.get("/find/:username", findUser);
router.delete("/delete/:username", deleteUser);

// ------------------ BULK DELETE USERS ------------------
router.post("/bulk-delete", bulkDeleteUsers);
router.get("/delete-template", downloadDeleteTemplate);

router.get("/export", exportUsers);
router.get("/export-users", protect, exportUsers);

export default router;

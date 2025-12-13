import User from "../models/User.js";
import generatePassword from "../utils/generatePassword.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import csv from "csvtojson";
import { Parser } from "json2csv";

// ---------------------- TOKEN GENERATOR ----------------------
const genToken = (id, role, state) => {
  return jwt.sign({ id, role, state }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// ---------------------- MASTER ADMIN CREATION ----------------------
export const registerMasterAdmin = async (req, res) => {
  try {
    const existing = await User.findOne({ role: "master-admin" });
    if (existing) return res.status(400).json({ message: "Master admin already exists" });

    const hashed = await bcrypt.hash("master123", 10);

    const user = await User.create({
      username: "Master Admin",
      email: "master@geteasytech.com",
      password: hashed,
      role: "master-admin",
      state: "ALL",
      mobileNumber: ""
    });

    res.json({ message: "Master admin created", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ---------------------- NORMAL USER CREATION ----------------------
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, mobileNumber, state } = req.body;

    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ message: "Username already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashed,
      mobileNumber,
      state: state, // state-admin creates within own state
    });

    res.json({ message: "User created", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ---------------------- LOGIN ----------------------
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ message: "Username & Password required" });

    // FIND USER BY USERNAME
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Wrong password" });

    const token = genToken(user._id, user.role, user.state);

    res.json({
      token,
      email: user.email,
      username: user.username,
      role: user.role,
      state: user.state,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------- FIND USER BY USERNAME ----------------------
export const findUser = async (req, res) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------------- GET USERS IN SAME STATE (STATE ADMIN) ----------------------
export const getAllUsersByState = async (req, res) => {
  try {
    const users = await User.find({ state: req.query.state, role: "user" });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =========================
// Get All Users
// =========================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // don't send password
    return res.status(200).json(users);
  } catch (err) {
    console.error("Get All Users Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// Get Users with Pagination + Search
// ===============================
export const getFilteredUsers = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;

    page = Number(page);
    limit = Number(limit);

    // Search by username or email (case-insensitive)
    const query = {
      role: "user",
      $or: [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ]
    };

    // Total count
    const total = await User.countDocuments(query);

    // Fetch paginated data
    const users = await User.find(query)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 }); // latest first

    return res.status(200).json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      users
    });

  } catch (error) {
    console.error("Pagination/Search Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ============================================================
//  BULK CREATE USERS + RETURN CSV WITH PLAIN PASSWORD
// ============================================================
export const bulkCreateUsers = async (req, res) => {
  try {
    // Must have file
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Convert CSV → JSON rows
    const rows = await csv().fromString(req.file.buffer.toString());

    if (!Array.isArray(rows)) {
      return res.status(400).json({ message: "Invalid CSV format" });
    }

    const final = [];

    for (const r of rows) {
      const username = r.username || r.Username;
      if (!username) continue;

      const exists = await User.findOne({ username });
      if (exists) continue;

      const rawPass = generatePassword();
      const hashed = await bcrypt.hash(rawPass, 10);

      const user = await User.create({
        username,
        email: r.email || "",
        mobileNumber: r.mobileNumber || "",
        password: hashed,
        role: "user",
        state: r.state || "",
      });

      final.push({
        username: user.username,
        email: user.email,
        mobileNumber: user.mobileNumber,
        password: rawPass,
      });
    }

    // Convert result back to CSV
    const fields = ["username", "email", "mobileNumber", "password"];
    const parser = new Parser({ fields });
    const csvOutput = parser.parse(final);

    res.setHeader("Content-Disposition", "attachment; filename=created_users.csv");
    res.setHeader("Content-Type", "text/csv");
    return res.status(200).send(csvOutput);

  } catch (err) {
    console.error("Bulk Upload Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ============================================================
//  DOWNLOAD TEMPLATE FOR BULK ADD
// ============================================================
export const downloadTemplate = (req, res) => {
  const csv = "username,email,mobileNumber,state";
  res.setHeader("Content-Disposition", "attachment; filename=user_template.csv");
  res.setHeader("Content-Type", "text/csv");
  res.status(200).send(csv);
};

// ===============================
// CHANGE PASSWORD CONTROLLER
// ===============================
export const changePassword = async (req, res) => {
  try {
    const { username, newPassword } = req.body;

    if (!username || !newPassword) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });

  } catch (error) {
    console.error("Change Password Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// CREATE STATE ADMIN
// ==============================
export const createStateAdmin = async (req, res) => {
  try {
    const { username, email, mobileNumber, state, password } = req.body;

    // Check if already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create state admin user
    const newAdmin = await User.create({
      username,
      email,
      mobileNumber,
      state,
      password: hashedPassword,
      role: "state-admin"
    });

    // Find all users in the same state
    const usersInState = await User.find({ state, role: "user" });

    // Map users to new state admin
    await User.updateMany(
      { state, role: "user" },
      { $set: { stateAdminId: newAdmin._id } }
    );

    res.status(201).json({
      message: "State admin created & users mapped successfully",
      admin: newAdmin,
      mappedUsers: usersInState.length,
    });

  } catch (error) {
    console.error("Error creating state admin:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get State Admin List with Pagination + Search
export const getStateAdmins = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;

    page = Number(page);
    limit = Number(limit);

    const query = {
      role: "state-admin",
      $or: [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobileNumber: { $regex: search, $options: "i" } }
      ],
    };

    const total = await User.countDocuments(query);
    const admins = await User.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ username: 1 });

    return res.json({
      admins,
      totalPages: Math.ceil(total / limit),
      total
    });

  } catch (err) {
    console.error("Fetch State Admin Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ============================================================
//  DELETE SINGLE USER
// ============================================================
export const deleteUser = async (req, res) => {
  try {
    const username = req.params.username;

    const user = await User.findOneAndDelete({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============================================================
//  BULK DELETE USERS
// ============================================================
export const bulkDeleteUsers = async (req, res) => {
  const usernames = req.body.map(u => u.username).filter(Boolean);
  await User.deleteMany({ username: { $in: usernames } });
  res.json({ message: "Bulk delete done" });
};

// ============================================================
//  DOWNLOAD TEMPLATE FOR BULK DELETE
// ============================================================
export const downloadDeleteTemplate = (req, res) => {
  const csv = "username\n";
  res.setHeader("Content-Disposition", "attachment; filename=delete_template.csv");
  res.setHeader("Content-Type", "text/csv");
  res.status(200).send(csv);
};

// ============================================================
//  EXPORT USERS (MASTER = ALL, STATE ADMIN = ONLY OWN STATE)
// ============================================================
export const exportUsers = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: req.user missing" });
    }

    let users;

    // MASTER ADMIN → return ALL users
    if (req.user.role === "master-admin") {
      users = await User.find();
    }

    // STATE ADMIN → return ONLY users from same state
    else if (req.user.role === "state-admin") {
      users = await User.find({ state: req.user.state });
    }

    // OTHER ROLES → reject
    else {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // CSV headers
    const csvHeaders = [
      "Name",
      "Email",
      "Phone",
      "Role",
      "State",
      "CreatedAt"
    ];

    // Convert to CSV rows
    const csvRows = users.map(user => [
      user.username || "",
      user.email || "",
      user.mobileNumber || "",
      user.role || "",
      user.state || "",
      user.createdAt?.toISOString() || ""
    ]);

    // Combine headers + rows into CSV string
    const csvContent =
      csvHeaders.join(",") +
      "\n" +
      csvRows.map(row => row.map(v => `"${v}"`).join(",")).join("\n");

    // Send CSV file response
    res.setHeader("Content-Disposition", "attachment; filename=users.csv");
    res.setHeader("Content-Type", "text/csv");

    return res.status(200).send(csvContent);

  } catch (error) {
    console.error("CSV Export Error:", error);
    res.status(500).json({ message: "Server Error during CSV export" });
  }
};
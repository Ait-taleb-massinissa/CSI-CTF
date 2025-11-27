import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  updatePassword,
  updateTheme,
} from "../controllers/authController.js";
import multer from "multer";
const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.post("/profile", getProfile);

// New profile update routes
router.post("/update-profile", updateProfile); // update username/email
router.post("/update-password", updatePassword); // update password
router.post("/update-theme", updateTheme); // update theme preference

export default router;

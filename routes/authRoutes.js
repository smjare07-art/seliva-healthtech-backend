const express = require("express");
const router = express.Router();
const upload =require("../middleware/upload");
const {
  createAdmin,
  register,
  login,
  addDoctor,
  sendOTP,
  verifyOTP,
  resetPassword,
  getDoctorCount,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  registerPatient,
  completeProfile,
  getPatientById,
  getUserProfile,
} = require("../controllers/authController");

// Auth
router.get("/create-admin", createAdmin);
router.post("/register", register);
router.post("/login", login);

// Doctor Management
router.post("/add-doctor", addDoctor);
router.get("/doctor-count", getDoctorCount);
router.get("/doctors", getDoctors);
router.get("/doctor/:id", getDoctorById);
router.put("/doctor/:id", updateDoctor);
router.delete("/doctor/:id", deleteDoctor);

// Forgot Password
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

//patient 
router.post("/register", register);
router.post(
  "/complete-profile",
  upload.single(
    "profileImage"
  ),
  completeProfile
);
router.get(
  "/patient/:id",
  getPatientById
);
router.get(
  "/user/:id",
  getUserProfile
);
module.exports = router;
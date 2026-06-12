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
  updateProfile,
  completeDoctorProfile,
  updateAvailability,
  sendRegisterOTP,
  verifyRegisterOTP,
  getPatientCount,
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
router.put(
  "/doctor/:id",

  upload.fields([
    {
      name:
        "profileImage",
      maxCount: 1,
    },
    {
      name:
        "licenseImage",
      maxCount: 1,
    },
    {
      name:
        "degreeCertificate",
      maxCount: 1,
    },
  ]),

  updateDoctor
);
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
router.put(
  "/user/:id",
  upload.single(
    "profileImage"
  ),
  updateProfile
);
router.post(
  "/doctor/complete-profile",

  upload.fields([
    {
      name: "profileImage",
      maxCount: 1,
    },
    {
      name: "licenseImage",
      maxCount: 1,
    },
    {
      name: "degreeCertificate",
      maxCount: 1,
    },
  ]),

  completeDoctorProfile
);
router.put(
  "/doctor-availability/:id",
  updateAvailability
);
router.post(
  "/send-register-otp",
  sendRegisterOTP
);

router.post(
  "/verify-register-otp",
  verifyRegisterOTP
);
router.get(
 "/patient-count",
 getPatientCount
);
module.exports = router;
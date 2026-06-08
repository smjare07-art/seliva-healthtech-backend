const express = require("express");
const router = express.Router();

const {
  createAdmin,
  register,
  login,
  sendOTP,
  verifyOTP,
  resetPassword,
  getDoctorCount,
  getDoctors,
  deleteDoctor,
  updateDoctor
} = require("../controllers/authController");
router.get("/create-admin", createAdmin);
router.post("/register", register);
router.post("/login", login);
const { addDoctor } = require("../controllers/authController");

router.post("/add-doctor", addDoctor);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);
router.get(
  "/doctor-count",
  getDoctorCount
);

router.get(
  "/doctors",
  getDoctors
);

router.put(
  "/doctor/:id",
  updateDoctor
);

router.delete(
  "/doctor/:id",
  deleteDoctor
);
module.exports = router;
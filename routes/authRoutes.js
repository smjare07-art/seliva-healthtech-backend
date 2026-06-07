const express = require("express");
const router = express.Router();

const {
  createAdmin,
  register,
  login,
} = require("../controllers/authController");
router.get("/create-admin", createAdmin);
router.post("/register", register);
router.post("/login", login);

module.exports = router;
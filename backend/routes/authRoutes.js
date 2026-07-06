const express = require("express");
const router = express.Router();

const {
  register,
  login,
} = require("../controllers/authController");

/* ================= AUTH ROUTES ================= */

// Register new admin/user
router.post(
  "/register",
  register
);

// Login admin/user
router.post(
  "/login",
  login
);

module.exports = router;
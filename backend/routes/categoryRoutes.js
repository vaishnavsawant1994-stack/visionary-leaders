const express = require("express");
const router = express.Router();

const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const protect = require("../middleware/authMiddleware");

/* ================= PUBLIC ROUTES ================= */

// Get all categories
router.get("/", getCategories);

// Get single category
router.get("/:id", getCategoryById);

/* ================= PROTECTED ROUTES ================= */

// Create category
router.post("/", protect, createCategory);

// Update category
router.put("/:id", protect, updateCategory);

// Delete category
router.delete("/:id", protect, deleteCategory);

module.exports = router;
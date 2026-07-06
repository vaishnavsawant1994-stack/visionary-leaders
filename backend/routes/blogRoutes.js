const express = require("express");
const router = express.Router();

const {
  createBlog,
  getBlogs,
  getBlogById,
  getPreviewBlog,
  getScheduledBlogs,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");

const protect = require("../middleware/authMiddleware");

/* ================= PUBLIC ROUTES ================= */

// Get all blogs
router.get("/", getBlogs);

// Get scheduled blogs
router.get(
  "/scheduled/list",
  protect,
  getScheduledBlogs
);

// Preview scheduled blog
router.get(
  "/preview/:id",
  protect,
  getPreviewBlog
);

// Get single blog
router.get("/:id", getBlogById);

/* ================= PROTECTED ROUTES ================= */

// Create blog
router.post(
  "/",
  protect,
  createBlog
);

// Update blog
router.put(
  "/:id",
  protect,
  updateBlog
);

// Delete blog
router.delete(
  "/:id",
  protect,
  deleteBlog
);

module.exports = router;
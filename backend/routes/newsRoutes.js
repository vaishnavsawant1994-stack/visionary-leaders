const express = require("express");
const router = express.Router();

const {
  createNews,
  getNews,
  getNewsById,
  getPreviewNews,
  getScheduledNews,
  updateNews,
  deleteNews,
} = require("../controllers/newsController");

const protect = require("../middleware/authMiddleware");

/* ================= PUBLIC ROUTES ================= */

// Get all news
router.get("/", getNews);

// Get scheduled news
router.get(
  "/scheduled/list",
  protect,
  getScheduledNews
);

// Preview scheduled news
router.get(
  "/preview/:id",
  protect,
  getPreviewNews
);

// Get single news
router.get("/:id", getNewsById);

/* ================= PROTECTED ROUTES ================= */

// Create news
router.post(
  "/",
  protect,
  createNews
);

// Update news
router.put(
  "/:id",
  protect,
  updateNews
);

// Delete news
router.delete(
  "/:id",
  protect,
  deleteNews
);

module.exports = router;
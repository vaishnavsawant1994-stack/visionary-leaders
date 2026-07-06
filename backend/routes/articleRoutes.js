const express = require("express");
const router = express.Router();

const {
  createArticle,
  getArticles,
  getArticleById,
  getPreviewArticle,
  updateArticle,
  deleteArticle,
  getScheduledArticles,
  publishArticleNow,
  archiveArticle,
} = require("../controllers/articleController");

const protect = require("../middleware/authMiddleware");
const uploadCover = require("../middleware/uploadCover");

/* ================= PUBLIC ROUTES ================= */

// Get all articles
router.get("/", getArticles);

// Get scheduled articles
router.get(
  "/scheduled/list",
  protect,
  getScheduledArticles
);

// Preview scheduled article
router.get(
  "/preview/:id",
  protect,
  getPreviewArticle
);

// Publish article immediately
router.put(
  "/publish/:id",
  protect,
  publishArticleNow
);

// Archive article
router.put(
  "/archive/:id",
  protect,
  archiveArticle
);

// Get single article
router.get("/:id", getArticleById);

/* ================= PROTECTED CRUD ================= */

// Create article
router.post(
  "/",
  protect,
  uploadCover.single("featuredImage"),
  createArticle
);

// Update article
router.put(
  "/:id",
  protect,
  uploadCover.single("featuredImage"),
  updateArticle
);

// Delete article
router.delete(
  "/:id",
  protect,
  deleteArticle
);

module.exports = router;
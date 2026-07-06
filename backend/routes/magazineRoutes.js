const express = require("express");
const router = express.Router();

const uploadMagazine = require("../middleware/uploadMagazine");
const protect = require("../middleware/authMiddleware");

const {
  createMagazine,
  getMagazines,
  getMagazineById,
  getPreviewMagazine,
  getScheduledMagazines,
  updateMagazine,
  deleteMagazine,
} = require("../controllers/magazineController");

/* ================= MULTER FIELDS ================= */
const magazineUploadFields = uploadMagazine.fields([
  {
    name: "coverImage",
    maxCount: 1,
  },
  {
    name: "pdf",
    maxCount: 1,
  },
]);

/* ================= PUBLIC ROUTES ================= */

// Get all magazines
router.get("/", getMagazines);

// Get single magazine
router.get("/:id", getMagazineById);

/* ================= ADMIN / PROTECTED ROUTES ================= */

// Create new magazine
router.post(
  "/",
  protect,
  magazineUploadFields,
  createMagazine
);

// Update magazine
router.put(
  "/:id",
  protect,
  magazineUploadFields,
  updateMagazine
);

// Delete magazine
router.delete(
  "/:id",
  protect,
  deleteMagazine
);

// Get all scheduled magazines
router.get(
  "/scheduled/list",
  protect,
  getScheduledMagazines
);

// Preview scheduled magazine
router.get(
  "/preview/:id",
  protect,
  getPreviewMagazine
);

module.exports = router;
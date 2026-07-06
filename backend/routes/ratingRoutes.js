const express = require("express");
const router = express.Router();

const {
  addRating,
  getMagazineRatings,
  getAllRatingsAnalytics,
} = require("../controllers/magazineRatingController");

/* ================= RATING ================= */
router.post("/:magazineId", addRating);

/* ================= SINGLE MAGAZINE ANALYTICS ================= */
router.get("/:magazineId", getMagazineRatings);

/* ================= ADMIN ANALYTICS ================= */
router.get("/", getAllRatingsAnalytics);

module.exports = router;
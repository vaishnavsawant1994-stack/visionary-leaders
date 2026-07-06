const express = require("express");
const router = express.Router();

const {
  subscribe,
  getSubscribers,
} = require("../controllers/subscriberController");

const protect = require("../middleware/authMiddleware");

/* =========================================
   PUBLIC ROUTES
========================================= */

// Create new subscriber
router.post("/", async (req, res, next) => {
  try {
    await subscribe(req, res);
  } catch (error) {
    console.error("Subscriber POST Route Error:", error);
    next(error);
  }
});

/* =========================================
   PROTECTED ROUTES (ADMIN ONLY)
========================================= */

// Get all subscribers
router.get("/", protect, async (req, res, next) => {
  try {
    await getSubscribers(req, res);
  } catch (error) {
    console.error("Subscriber GET Route Error:", error);
    next(error);
  }
});

module.exports = router;
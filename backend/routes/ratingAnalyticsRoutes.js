const express = require("express");
const router = express.Router();
const prisma = require("../config/prisma");

router.get("/", async (req, res) => {
  try {
    const ratings = await prisma.magazineRating.findMany({
      include: {
        magazine: true,
      },
    });

    const grouped = {};

    for (const rating of ratings) {
      const magId = rating.magazineId;

      if (!grouped[magId]) {
        grouped[magId] = {
          magazineId: magId,
          title: rating.magazine?.title || "Unknown",
          ratings: [],
        };
      }

      grouped[magId].ratings.push(Number(rating.rating));
    }

    const analytics = Object.values(grouped).map((mag) => {
      const ratingsArr = mag.ratings;
      const total = ratingsArr.length;

      const sum = ratingsArr.reduce((a, b) => a + b, 0);

      const average = total > 0 ? sum / total : 0;

      const breakdown = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      };

      for (const r of ratingsArr) {
        if (breakdown[r] !== undefined) {
          breakdown[r]++;
        }
      }

      return {
        magazineId: mag.magazineId,
        title: mag.title,
        totalRatings: total,
        averageRating: Number(average.toFixed(1)), // 🔥 FIXED (NUMBER)
        breakdown,
      };
    });

    // 🔥 SAFE SORT (numeric)
    analytics.sort(
      (a, b) => b.averageRating - a.averageRating
    );

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error("RATING ANALYTICS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
});

module.exports = router;
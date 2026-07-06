const prisma = require("../config/prisma");

/* ================= ADD RATING ================= */
const addRating = async (req, res) => {
  try {
    const { magazineId } = req.params;
    const { rating } = req.body;

    const value = Number(rating);

    if (!value || value < 1 || value > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const newRating = await prisma.magazineRating.create({
      data: {
        magazineId: Number(magazineId),
        rating: value,
      },
    });

    return res.json({
      success: true,
      data: newRating,
    });
  } catch (error) {
    console.error("ADD RATING ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add rating",
    });
  }
};

/* ================= GET MAGAZINE RATINGS ================= */
const getMagazineRatings = async (req, res) => {
  try {
    const { magazineId } = req.params;

    const ratings = await prisma.magazineRating.findMany({
      where: {
        magazineId: Number(magazineId),
      },
    });

    const total = ratings.length;

    const average =
      total > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / total
        : 0;

    const breakdown = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    ratings.forEach((r) => {
      if (breakdown[r.rating] !== undefined) {
        breakdown[r.rating]++;
      }
    });

    return res.json({
      success: true,
      totalRatings: total,
      averageRating: Number(average.toFixed(1)),
      breakdown,
    });
  } catch (error) {
    console.error("GET RATINGS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch ratings",
    });
  }
};

/* ================= ADMIN ANALYTICS ================= */
const getAllRatingsAnalytics = async (req, res) => {
  try {
    const data = await prisma.magazineRating.groupBy({
      by: ["magazineId"],
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("ADMIN ANALYTICS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};

module.exports = {
  addRating,
  getMagazineRatings,
  getAllRatingsAnalytics,
};
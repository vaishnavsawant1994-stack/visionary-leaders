const prisma = require("../config/prisma");

/* ================= CREATE RATING ================= */
const createRating = async (req, res) => {
  try {
    const { value, blogId, newsId } = req.body;

    if (!value) {
      return res.status(400).json({
        success: false,
        message: "Rating value is required",
      });
    }

    const rating = await prisma.rating.create({
      data: {
        value: Number(value), // 🔥 IMPORTANT FIX
        blogId: blogId ? Number(blogId) : null,
        newsId: newsId ? Number(newsId) : null,
      },
    });

    return res.json({
      success: true,
      data: rating,
    });
  } catch (error) {
    console.error("CREATE RATING ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create rating",
    });
  }
};

/* ================= GET RATINGS ================= */
const getRatings = async (req, res) => {
  try {
    const ratings = await prisma.rating.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return res.json({
      success: true,
      data: ratings,
    });
  } catch (error) {
    console.error("GET RATINGS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch ratings",
    });
  }
};

/* ================= GET AVERAGE RATING ================= */
const getRatingStats = async (req, res) => {
  try {
    const ratings = await prisma.rating.findMany();

    const total = ratings.length;

    const average =
      total > 0
        ? ratings.reduce((acc, r) => acc + r.value, 0) / total
        : 0;

    const distribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    ratings.forEach((r) => {
      if (distribution[r.value] !== undefined) {
        distribution[r.value]++;
      }
    });

    return res.json({
      success: true,
      data: {
        totalRatings: total,
        averageRating: Number(average.toFixed(2)),
        distribution,
      },
    });
  } catch (error) {
    console.error("RATING STATS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch rating stats",
    });
  }
};

module.exports = {
  createRating,
  getRatings,
  getRatingStats,
};
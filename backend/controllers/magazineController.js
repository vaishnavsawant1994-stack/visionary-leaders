const prisma = require("../config/prisma");

/* ================= CREATE MAGAZINE ================= */
const createMagazine = async (req, res) => {
  try {
    const {
      title,
      slug,
      edition,
      description,
      categoryId,
      featured,
      status,
      publishedDate,
      scheduledPublishDate,
    } = req.body;

    let coverImage = "";
    let pdfUrl = "";

    if (req.files?.coverImage?.length) {
      coverImage = `/uploads/covers/${req.files.coverImage[0].filename}`;
    }

    if (req.files?.pdf?.length) {
      pdfUrl = `/uploads/magazines/${req.files.pdf[0].filename}`;
    }

    let finalStatus = status || "DRAFT";
    let finalPublishDate = null;
    let finalScheduledDate = null;

    if (finalStatus === "PUBLISHED") {
      finalPublishDate = publishedDate
        ? new Date(publishedDate)
        : new Date();
    }

    if (finalStatus === "SCHEDULED") {
      finalScheduledDate = scheduledPublishDate
        ? new Date(scheduledPublishDate)
        : null;
    }

    const magazine = await prisma.magazine.create({
      data: {
        title,
        slug,
        edition,
        description,
        categoryId: categoryId ? Number(categoryId) : null,
        featured: featured === "true" || featured === true,
        status: finalStatus,
        publishDate: finalPublishDate,
        scheduledPublishDate: finalScheduledDate,
        coverImage,
        pdfUrl,
      },
      include: {
        category: true,
        ratings: true,
      },
    });

    res.json({
      success: true,
      data: magazine,
    });
  } catch (error) {
    console.error("CREATE MAGAZINE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create magazine",
    });
  }
};

/* ================= GET ALL MAGAZINES (FIXED SEARCH + CATEGORY) ================= */
const getMagazines = async (req, res) => {
  try {
    const { category, featured, search } = req.query;

    let whereClause = {
      status: "PUBLISHED",
    };

    /* ================= SEARCH FILTER ================= */
    if (search && search.trim() !== "") {
      whereClause.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    /* ================= CATEGORY FILTER (FIXED) ================= */
    if (category && category !== "All") {
      whereClause.category = {
        is: {
          name: {
            equals: category,
            mode: "insensitive",
          },
        },
      };
    }

    /* ================= FEATURED FILTER ================= */
    if (featured === "true") {
      whereClause.featured = true;
    }

    const magazines = await prisma.magazine.findMany({
      where: whereClause,
      include: {
        category: true,
        ratings: true,
      },
      orderBy: {
        publishDate: "desc",
      },
    });

    const formattedMagazines = magazines.map((mag) => {
      const totalRatings = mag.ratings.length;

      const averageRating =
        totalRatings > 0
          ? (
              mag.ratings.reduce(
                (sum, rating) => sum + rating.rating,
                0
              ) / totalRatings
            ).toFixed(1)
          : "0";

      return {
        ...mag,
        averageRating,
        totalRatings,
      };
    });

    res.json({
      success: true,
      data: formattedMagazines,
    });
  } catch (error) {
    console.error("GET MAGAZINES ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch magazines",
    });
  }
};

/* ================= GET SINGLE MAGAZINE ================= */
const getMagazineById = async (req, res) => {
  try {
    const magazine = await prisma.magazine.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        category: true,
        ratings: true,
      },
    });

    if (!magazine) {
      return res.status(404).json({
        success: false,
        message: "Magazine not found",
      });
    }

    const totalRatings = magazine.ratings.length;

    const averageRating =
      totalRatings > 0
        ? (
            magazine.ratings.reduce(
              (sum, rating) => sum + rating.rating,
              0
            ) / totalRatings
          ).toFixed(1)
        : "0";

    res.json({
      success: true,
      data: {
        ...magazine,
        averageRating,
        totalRatings,
      },
    });
  } catch (error) {
    console.error("GET SINGLE MAGAZINE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch magazine",
    });
  }
};

/* ================= PREVIEW MAGAZINE ================= */
const getPreviewMagazine = async (req, res) => {
  try {
    const magazine = await prisma.magazine.findFirst({
      where: {
        id: Number(req.params.id),
        status: "SCHEDULED",
      },
      include: {
        category: true,
      },
    });

    res.json({
      success: true,
      data: magazine,
    });
  } catch (error) {
    console.error("PREVIEW MAGAZINE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch preview magazine",
    });
  }
};

/* ================= GET SCHEDULED MAGAZINES ================= */
const getScheduledMagazines = async (req, res) => {
  try {
    const magazines = await prisma.magazine.findMany({
      where: {
        status: "SCHEDULED",
      },
      include: {
        category: true,
      },
      orderBy: {
        scheduledPublishDate: "asc",
      },
    });

    res.json({
      success: true,
      data: magazines,
    });
  } catch (error) {
    console.error("SCHEDULED MAGAZINES ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch scheduled magazines",
    });
  }
};

/* ================= UPDATE MAGAZINE ================= */
const updateMagazine = async (req, res) => {
  try {
    const data = { ...req.body };

    if (req.files?.coverImage?.length) {
      data.coverImage = `/uploads/covers/${req.files.coverImage[0].filename}`;
    }

    if (req.files?.pdf?.length) {
      data.pdfUrl = `/uploads/magazines/${req.files.pdf[0].filename}`;
    }

    if (data.categoryId) {
      data.categoryId = Number(data.categoryId);
    }

    if (data.publishedDate) {
      data.publishDate = new Date(data.publishedDate);
      delete data.publishedDate;
    }

    if (data.scheduledPublishDate) {
      data.scheduledPublishDate = new Date(data.scheduledPublishDate);
    }

    if (data.featured !== undefined) {
      data.featured =
        data.featured === "true" || data.featured === true;
    }

    const magazine = await prisma.magazine.update({
      where: {
        id: Number(req.params.id),
      },
      data,
      include: {
        category: true,
      },
    });

    res.json({
      success: true,
      data: magazine,
    });
  } catch (error) {
    console.error("UPDATE MAGAZINE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update magazine",
    });
  }
};

/* ================= DELETE MAGAZINE ================= */
const deleteMagazine = async (req, res) => {
  try {
    await prisma.magazine.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    res.json({
      success: true,
    });
  } catch (error) {
    console.error("DELETE MAGAZINE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete magazine",
    });
  }
};

module.exports = {
  createMagazine,
  getMagazines,
  getMagazineById,
  getPreviewMagazine,
  getScheduledMagazines,
  updateMagazine,
  deleteMagazine,
};
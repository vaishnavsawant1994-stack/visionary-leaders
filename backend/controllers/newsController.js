const prisma = require("../config/prisma");

/* ================= HELPERS ================= */
const normalizeStatus = (status) =>
  (status || "").toString().toUpperCase();

const now = new Date();

/* ================= CREATE NEWS ================= */
const createNews = async (req, res) => {
  try {
    const {
      title,
      content,
      image,
      category,
      author,
      status,
      scheduledPublishDate,
    } = req.body;

    let finalStatus = "DRAFT";
    let publishDate = null;
    let finalScheduledDate = null;

    const normalizedStatus = normalizeStatus(status);

    if (normalizedStatus === "PUBLISHED") {
      finalStatus = "PUBLISHED";
      publishDate = new Date();
    }

    if (normalizedStatus === "SCHEDULED") {
      if (!scheduledPublishDate) {
        return res.status(400).json({
          success: false,
          message: "Scheduled publish date required",
        });
      }

      const scheduledDate = new Date(scheduledPublishDate);

      if (scheduledDate <= new Date()) {
        return res.status(400).json({
          success: false,
          message: "Scheduled date must be in future",
        });
      }

      finalStatus = "SCHEDULED";
      finalScheduledDate = scheduledDate;
    }

    const news = await prisma.news.create({
      data: {
        title,
        content,
        image,
        category,
        author,
        status: finalStatus,
        publishDate,
        scheduledPublishDate: finalScheduledDate,
      },
    });

    res.json({ success: true, data: news });
  } catch (error) {
    console.error("CREATE NEWS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create news",
    });
  }
};

/* ================= GET ALL NEWS (FIXED + SAFE) ================= */
const getNews = async (req, res) => {
  try {
    const { search } = req.query;

    let news = await prisma.news.findMany({
      orderBy: { createdAt: "desc" },
    });

    // 🔥 FILTER SAFE SCHEDULING LOGIC
    news = news.filter((item) => {
      const status = normalizeStatus(item.status);

      if (status === "PUBLISHED") return true;

      if (status === "SCHEDULED") {
        if (!item.scheduledPublishDate) return false;

        return new Date(item.scheduledPublishDate) <= now;
      }

      return false;
    });

    // 🔍 SEARCH FILTER
    if (search && search.trim() !== "") {
      const s = search.toLowerCase();

      news = news.filter(
        (n) =>
          n.title?.toLowerCase().includes(s) ||
          n.content?.toLowerCase().includes(s)
      );
    }

    return res.json({
      success: true,
      data: news,
    });
  } catch (error) {
    console.error("GET NEWS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch news",
    });
  }
};

/* ================= GET SINGLE NEWS (FULLY FIXED) ================= */
const getNewsById = async (req, res) => {
  try {
    const id = req.params.id;

    const news = await prisma.news.findUnique({
      where: {
        id: isNaN(Number(id)) ? id : Number(id),
      },
    });

    if (!news) {
      return res.json({
        success: false,
        message: "News not found",
        data: null,
      });
    }

    const status = normalizeStatus(news.status);

    // ❌ BLOCK DRAFT
    if (status === "DRAFT") {
      return res.json({
        success: false,
        message: "News is draft",
        data: null,
      });
    }

    // ❌ BLOCK FUTURE SCHEDULED
    if (
      status === "SCHEDULED" &&
      news.scheduledPublishDate &&
      new Date(news.scheduledPublishDate) > now
    ) {
      return res.json({
        success: false,
        message: "News scheduled for future",
        data: null,
      });
    }

    return res.json({
      success: true,
      data: news,
    });
  } catch (error) {
    console.error("GET NEWS BY ID ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch news",
    });
  }
};

/* ================= PREVIEW NEWS ================= */
const getPreviewNews = async (req, res) => {
  try {
    const news = await prisma.news.findFirst({
      where: {
        id: Number(req.params.id),
        status: "SCHEDULED",
      },
    });

    res.json({ success: true, data: news });
  } catch (error) {
    console.error("PREVIEW NEWS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch preview news",
    });
  }
};

/* ================= GET SCHEDULED NEWS ================= */
const getScheduledNews = async (req, res) => {
  try {
    const news = await prisma.news.findMany({
      where: { status: "SCHEDULED" },
      orderBy: { scheduledPublishDate: "asc" },
    });

    res.json({ success: true, data: news });
  } catch (error) {
    console.error("SCHEDULED NEWS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch scheduled news",
    });
  }
};

/* ================= UPDATE NEWS ================= */
const updateNews = async (req, res) => {
  try {
    const {
      title,
      summary,
      content,
      image,
      category,
      source,
      author,
      status,
      scheduledPublishDate,
    } = req.body;

    const normalizedStatus = normalizeStatus(status);

    let finalStatus = normalizedStatus || "DRAFT";
    let publishDate = null;
    let finalScheduledDate = null;

    if (finalStatus === "PUBLISHED") {
      publishDate = new Date();
    }

    if (finalStatus === "SCHEDULED") {
      if (!scheduledPublishDate) {
        return res.status(400).json({
          success: false,
          message: "Scheduled publish date required",
        });
      }

      const scheduledDate = new Date(scheduledPublishDate);

      if (scheduledDate <= new Date()) {
        return res.status(400).json({
          success: false,
          message: "Scheduled date must be in future",
        });
      }

      finalScheduledDate = scheduledDate;
    }

    const news = await prisma.news.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        title,
        aiSummary: summary,
        content,
        image,
        category,
        source,
        author,
        status: finalStatus,
        publishDate,
        scheduledPublishDate: finalScheduledDate,
      },
    });

    res.json({
      success: true,
      data: {
        ...news,
        summary: news.aiSummary,
      },
    });
  } catch (error) {
    console.error("UPDATE NEWS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update news",
    });
  }
};

/* ================= DELETE NEWS ================= */
const deleteNews = async (req, res) => {
  try {
    await prisma.news.delete({
      where: {
        id: isNaN(Number(req.params.id))
          ? req.params.id
          : Number(req.params.id),
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.error("DELETE NEWS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete news",
    });
  }
};

module.exports = {
  createNews,
  getNews,
  getNewsById,
  getPreviewNews,
  getScheduledNews,
  updateNews,
  deleteNews,
};
const prisma = require("../config/prisma");

/* ================= CREATE ARTICLE ================= */
const createArticle = async (req, res) => {
  try {
    const {
      title,
      slug,
      summary,
      content,
      seoTitle,
      seoDescription,
      tags,
      status,
      featured,
      scheduledPublishDate,
      categoryId,
      authorId,
      featuredImage,
    } = req.body;

    if (!title || !slug || !categoryId || !authorId) {
      return res.status(400).json({
        success: false,
        message:
          "Title, slug, categoryId and authorId are required",
      });
    }

    const authorExists = await prisma.user.findUnique({
      where: { id: Number(authorId) },
    });

    const categoryExists = await prisma.category.findUnique({
      where: { id: Number(categoryId) },
    });

    if (!authorExists || !categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid author or category",
      });
    }

    let parsedTags = [];
    try {
      parsedTags = tags ? JSON.parse(tags) : [];
    } catch {
      parsedTags = [];
    }

    let finalStatus = "DRAFT";
    let publishDate = null;
    let finalScheduledDate = null;

    /* PUBLISHED */
    if (status?.toLowerCase() === "published") {
      finalStatus = "PUBLISHED";
      publishDate = new Date();
    }

    /* SCHEDULED */
    if (status?.toLowerCase() === "scheduled") {
      if (!scheduledPublishDate) {
        return res.status(400).json({
          success: false,
          message: "Scheduled publish date required",
        });
      }

      const scheduledDate = new Date(
        scheduledPublishDate
      );

      if (scheduledDate <= new Date()) {
        return res.status(400).json({
          success: false,
          message:
            "Scheduled date must be in future",
        });
      }

      finalStatus = "SCHEDULED";
      finalScheduledDate = scheduledDate;
    }

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        summary: summary || "",
        content: content || "",
        seoTitle: seoTitle || "",
        seoDescription: seoDescription || "",
        tags: parsedTags,
        status: finalStatus,
        featured:
          featured === "true" ||
          featured === true,
        publishDate,
        scheduledPublishDate:
          finalScheduledDate,
        featuredImage: featuredImage
          ? featuredImage
          : req.file
          ? `/uploads/articles/${req.file.filename}`
          : "/placeholder.jpg",
        categoryId: Number(categoryId),
        authorId: Number(authorId),
      },
      include: {
        category: true,
        author: true,
      },
    });

    res.status(201).json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error(
      "CREATE ARTICLE ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ALL ARTICLES (PUBLIC) ================= */
const getArticles = async (req, res) => {
  try {
    const { search } = req.query;

    const articles =
      await prisma.article.findMany({
        where: {
          status: "PUBLISHED",
          publishDate: {
            not: null,
            lte: new Date(),
          },

          ...(search && {
            OR: [
              {
                title: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                summary: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }),
        },
        include: {
          category: true,
          author: true,
        },
        orderBy: {
          publishDate: "desc",
        },
      });

    res.json({
      success: true,
      data: articles,
    });
  } catch (error) {
    console.error(
      "GET ARTICLES ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET SINGLE ARTICLE (PUBLIC) ================= */
const getArticleById = async (
  req,
  res
) => {
  try {
    const article =
      await prisma.article.findFirst({
        where: {
          id: Number(req.params.id),
          status: "PUBLISHED",
          publishDate: {
            not: null,
            lte: new Date(),
          },
        },
        include: {
          category: true,
          author: true,
        },
      });

    res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error(
      "GET ARTICLE ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= PREVIEW ARTICLE ================= */
const getPreviewArticle = async (
  req,
  res
) => {
  try {
    const article =
      await prisma.article.findFirst({
        where: {
          id: Number(req.params.id),
          status: "SCHEDULED",
        },
        include: {
          category: true,
          author: true,
        },
      });

    res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error(
      "PREVIEW ARTICLE ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET SCHEDULED ARTICLES (ADMIN) ================= */
const getScheduledArticles = async (
  req,
  res
) => {
  try {
    const articles =
      await prisma.article.findMany({
        where: {
          status: "SCHEDULED",
        },
        include: {
          category: true,
          author: true,
        },
        orderBy: {
          scheduledPublishDate: "asc",
        },
      });

    res.status(200).json({
      success: true,
      data: articles,
    });
  } catch (error) {
    console.error(
      "GET SCHEDULED ARTICLES ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE ARTICLE ================= */
const updateArticle = async (
  req,
  res
) => {
  try {
    const id = Number(req.params.id);
    const data = { ...req.body };

    if (req.file) {
      data.featuredImage = `/uploads/articles/${req.file.filename}`;
    }

    if (data.tags) {
      try {
        data.tags = JSON.parse(data.tags);
      } catch {
        data.tags = [];
      }
    }

    if (data.categoryId) {
      data.categoryId = Number(
        data.categoryId
      );
    }

    if (data.authorId) {
      data.authorId = Number(
        data.authorId
      );
    }

    if (
      typeof data.featured === "string"
    ) {
      data.featured =
        data.featured === "true";
    }

    /* DRAFT */
    if (data.status?.toLowerCase() === "draft") {
      data.status = "DRAFT";
      data.publishDate = null;
      data.scheduledPublishDate = null;
    }

    /* PUBLISHED */
    if (
      data.status?.toLowerCase() ===
      "published"
    ) {
      data.status = "PUBLISHED";
      data.publishDate = new Date();
      data.scheduledPublishDate = null;
    }

    /* SCHEDULED */
    if (
      data.status?.toLowerCase() ===
      "scheduled"
    ) {
      if (!data.scheduledPublishDate) {
        return res.status(400).json({
          success: false,
          message:
            "Scheduled publish date required",
        });
      }

      const scheduledDate = new Date(
        data.scheduledPublishDate
      );

      if (scheduledDate <= new Date()) {
        return res.status(400).json({
          success: false,
          message:
            "Scheduled date must be in future",
        });
      }

      data.status = "SCHEDULED";
      data.publishDate = null;
      data.scheduledPublishDate =
        scheduledDate;
    }

    const article =
      await prisma.article.update({
        where: { id },
        data,
        include: {
          category: true,
          author: true,
        },
      });

    res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error(
      "UPDATE ARTICLE ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= DELETE ARTICLE ================= */
const deleteArticle = async (
  req,
  res
) => {
  try {
    await prisma.article.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    res.json({
      success: true,
      message:
        "Article deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE ARTICLE ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= PUBLISH NOW ================= */
const publishArticleNow = async (
  req,
  res
) => {
  try {
    const article =
      await prisma.article.update({
        where: {
          id: Number(req.params.id),
        },
        data: {
          status: "PUBLISHED",
          publishDate: new Date(),
          scheduledPublishDate: null,
        },
      });

    res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error(
      "PUBLISH ARTICLE ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= ARCHIVE ARTICLE ================= */
const archiveArticle = async (
  req,
  res
) => {
  try {
    const article =
      await prisma.article.update({
        where: {
          id: Number(req.params.id),
        },
        data: {
          status: "ARCHIVED",
        },
      });

    res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error(
      "ARCHIVE ARTICLE ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createArticle,
  getArticles,
  getArticleById,
  getPreviewArticle,
  getScheduledArticles,
  updateArticle,
  deleteArticle,
  publishArticleNow,
  archiveArticle,
};
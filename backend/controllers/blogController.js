const prisma = require("../config/prisma");

/* ================= CREATE BLOG ================= */
const createBlog = async (req, res) => {
  try {
    const {
      title,
      excerpt,
      content,
      image,
      author,
      category,
      status,
      scheduledPublishDate,
    } = req.body;

    let finalStatus = "DRAFT";
    let publishDate = null;
    let finalScheduledDate = null;

    if (status?.toLowerCase() === "published") {
      finalStatus = "PUBLISHED";
      publishDate = new Date();
    }

    if (status?.toLowerCase() === "scheduled") {
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

    const blog = await prisma.blog.create({
      data: {
        title,
        excerpt,
        content,
        image,
        coverImage: image, // FIXED
        author,
        category,
        status: finalStatus,
        publishDate,
        scheduledPublishDate: finalScheduledDate,
      },
    });

    res.json({ success: true, data: blog });
  } catch (error) {
    console.error("CREATE BLOG ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create blog",
    });
  }
};

/* ================= GET ALL BLOGS (FINAL FIXED VERSION) ================= */
const getBlogs = async (req, res) => {
  try {
    const { search } = req.query;
    const now = new Date();

    let blogs = await prisma.blog.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    blogs = blogs.filter((blog) => {
      if (blog.status === "PUBLISHED") return true;

      if (blog.status === "SCHEDULED") {
        return (
          blog.scheduledPublishDate &&
          new Date(blog.scheduledPublishDate) <= now
        );
      }

      return false;
    });

    if (search && search.trim() !== "") {
      const s = search.toLowerCase();

      blogs = blogs.filter((blog) => {
        return (
          blog.title?.toLowerCase().includes(s) ||
          blog.excerpt?.toLowerCase().includes(s) ||
          blog.content?.toLowerCase().includes(s)
        );
      });
    }

    blogs = blogs.map((blog) => ({
      ...blog,
      coverImage: blog.coverImage || blog.image, // FIXED
    }));

    res.json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    console.error("GET BLOGS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
    });
  }
};

/* ================= GET SINGLE BLOG (SAFE FIX) ================= */
const getBlogById = async (req, res) => {
  try {
    const now = new Date();

    const blog = await prisma.blog.findFirst({
      where: {
        id: Number(req.params.id),
      },
    });

    if (!blog) {
      return res.json({ success: true, data: null });
    }

    if (blog.status === "DRAFT") {
      return res.json({ success: true, data: null });
    }

    if (
      blog.status === "SCHEDULED" &&
      blog.scheduledPublishDate &&
      new Date(blog.scheduledPublishDate) > now
    ) {
      return res.json({ success: true, data: null });
    }

    res.json({
      success: true,
      data: {
        ...blog,
        coverImage: blog.coverImage || blog.image, // FIXED
      },
    });
  } catch (error) {
    console.error("GET BLOG ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
    });
  }
};

/* ================= OTHER FUNCTIONS (UNCHANGED) ================= */

const getPreviewBlog = async (req, res) => {
  try {
    const blog = await prisma.blog.findFirst({
      where: {
        id: Number(req.params.id),
        status: "SCHEDULED",
      },
    });

    res.json({ success: true, data: blog });
  } catch (error) {
    console.error("PREVIEW BLOG ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch preview blog",
    });
  }
};

const getScheduledBlogs = async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany({
      where: { status: "SCHEDULED" },
      orderBy: { scheduledPublishDate: "asc" },
    });

    res.json({ success: true, data: blogs });
  } catch (error) {
    console.error("SCHEDULED BLOGS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch scheduled blogs",
    });
  }
};

/* ================= UPDATE BLOG ================= */
const updateBlog = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = { ...req.body };

    if (data.image) {
      data.coverImage = data.image; // FIXED
    }

    if (data.status?.toLowerCase() === "draft") {
      data.status = "DRAFT";
      data.publishDate = null;
      data.scheduledPublishDate = null;
    }

    if (data.status?.toLowerCase() === "published") {
      data.status = "PUBLISHED";
      data.publishDate = new Date();
      data.scheduledPublishDate = null;
    }

    if (data.status?.toLowerCase() === "scheduled") {
      if (!data.scheduledPublishDate) {
        return res.status(400).json({
          success: false,
          message: "Scheduled publish date required",
        });
      }

      const scheduledDate = new Date(data.scheduledPublishDate);

      if (scheduledDate <= new Date()) {
        return res.status(400).json({
          success: false,
          message: "Scheduled date must be in future",
        });
      }

      data.status = "SCHEDULED";
      data.publishDate = null;
      data.scheduledPublishDate = scheduledDate;
    }

    const blog = await prisma.blog.update({
      where: { id },
      data,
    });

    res.json({ success: true, data: blog });
  } catch (error) {
    console.error("UPDATE BLOG ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update blog",
    });
  }
};

/* ================= DELETE BLOG ================= */
const deleteBlog = async (req, res) => {
  try {
    await prisma.blog.delete({
      where: { id: Number(req.params.id) },
    });

    res.json({ success: true });
  } catch (error) {
    console.error("DELETE BLOG ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete blog",
    });
  }
};

module.exports = {
  createBlog,
  getBlogs,
  getBlogById,
  getPreviewBlog,
  getScheduledBlogs,
  updateBlog,
  deleteBlog,
};
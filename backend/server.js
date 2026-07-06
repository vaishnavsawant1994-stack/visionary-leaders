require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const startScheduler = require("./cron/scheduler");

/* ================= ROUTES ================= */
const authRoutes = require("./routes/authRoutes");
const articleRoutes = require("./routes/articleRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const magazineRoutes = require("./routes/magazineRoutes");
const subscriberRoutes = require("./routes/subscriberRoutes");
const blogRoutes = require("./routes/blogRoutes");
const newsRoutes = require("./routes/newsRoutes");
const aiRoutes = require("./routes/aiRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const ratingAnalyticsRoutes = require("./routes/ratingAnalyticsRoutes");

/* 🔥 TRANSLATION ROUTE ADDED */
const translateRoutes = require("./routes/translateRoutes");

const app = express();

/* ================= START SCHEDULER ================= */
startScheduler();

/* ================= GLOBAL ERROR HANDLERS ================= */
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
});

/* ================= SECURITY HEADERS ================= */
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

/* ================= CORS ================= */
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

/* ================= BODY PARSER ================= */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ================= STATIC FILES ================= */
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.use(
  "/uploads/articles",
  express.static(path.join(__dirname, "uploads/articles"))
);

app.use(
  "/uploads/magazines",
  express.static(path.join(__dirname, "uploads/magazines"))
);

app.use(
  "/uploads/blogs",
  express.static(path.join(__dirname, "uploads/blogs"))
);

app.use(
  "/uploads/news",
  express.static(path.join(__dirname, "uploads/news"))
);

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Running 🚀",
  });
});

/* ================= API ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/magazines", magazineRoutes);
app.use("/api/subscribers", subscriberRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/news", newsRoutes);

app.use("/api/ratings", ratingRoutes);
app.use("/api/rating-analytics", ratingAnalyticsRoutes);

/* 🔥 AI ROUTES */
app.use("/api/ai", aiRoutes);

/* 🔥 TRANSLATION ROUTE */
app.use("/api/translate", translateRoutes);

/* ================= 404 HANDLER ================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* ================= GLOBAL ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

/* ================= GRACEFUL SHUTDOWN ================= */
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received. Closing server...");

  server.close(() => {
    console.log("✅ Server closed");
  });
});
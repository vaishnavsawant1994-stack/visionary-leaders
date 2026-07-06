const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

/* ================= AUTH MIDDLEWARE ================= */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    /* ================= HEADER CHECK ================= */
    if (!authHeader || typeof authHeader !== "string") {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing",
      });
    }

    /* ================= TOKEN FORMAT CHECK ================= */
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization must be: Bearer <token>",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token || token === "null" || token === "undefined") {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    /* ================= SECRET ================= */
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error("❌ JWT_SECRET missing in .env");

      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    /* ================= VERIFY TOKEN ================= */
    const decoded = jwt.verify(token, secret);

    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    const userId = Number(decoded.id); // ✅ FIXED (Prisma expects Int)

    /* ================= FIND USER ================= */
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    /* ================= ATTACH USER ================= */
    req.user = user;

    next();
  } catch (error) {
    console.error("🔥 AUTH ERROR:", error.message);

    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

module.exports = protect;
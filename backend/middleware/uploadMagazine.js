const multer = require("multer");
const fs = require("fs");
const path = require("path");

/* ================= DIRECTORIES ================= */
const coversDir = path.join(__dirname, "../uploads/covers");
const magazinesDir = path.join(__dirname, "../uploads/magazines");

/* Create folders if missing */
if (!fs.existsSync(coversDir)) {
  fs.mkdirSync(coversDir, { recursive: true });
}

if (!fs.existsSync(magazinesDir)) {
  fs.mkdirSync(magazinesDir, { recursive: true });
}

/* ================= STORAGE ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      if (file.fieldname === "coverImage") {
        return cb(null, coversDir);
      }

      if (file.fieldname === "pdf") {
        return cb(null, magazinesDir);
      }

      return cb(new Error("Invalid file field"));
    } catch (error) {
      return cb(error);
    }
  },

  filename: (req, file, cb) => {
    try {
      const cleanName = file.originalname.replace(/\s+/g, "-");
      cb(null, `${Date.now()}-${cleanName}`);
    } catch (error) {
      cb(error);
    }
  },
});

/* ================= FILE FILTER ================= */
const fileFilter = (req, file, cb) => {
  try {
    if (file.fieldname === "coverImage") {
      if (file.mimetype.startsWith("image/")) {
        return cb(null, true);
      }

      return cb(new Error("Only image files are allowed for cover"));
    }

    if (file.fieldname === "pdf") {
      if (file.mimetype === "application/pdf") {
        return cb(null, true);
      }

      return cb(new Error("Only PDF files are allowed"));
    }

    return cb(new Error("Unexpected file field"));
  } catch (error) {
    return cb(error);
  }
};

/* ================= MULTER INSTANCE ================= */
const uploadMagazine = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },
});

module.exports = uploadMagazine;
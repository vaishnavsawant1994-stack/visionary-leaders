const multer = require("multer");
const path = require("path");

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/articles");
  },

  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + "-" + file.originalname
    );
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes =
    /jpg|jpeg|png|webp/;

  const extname =
    allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

  const mimetype =
    allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }

  cb(
    new Error(
      "Only images are allowed"
    )
  );
};

// Upload middleware
const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;
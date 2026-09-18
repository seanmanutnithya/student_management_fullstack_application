const multer = require("multer");
const path = require("path");
const fs = require("fs");

// One source of truth for where uploads live. Absolute, so it does not depend
// on the directory the server was started from.
const UPLOAD_DIR = path.join(__dirname, "../../uploads");

// multer only creates this for us when `destination` is a string, not a
// function, so create it ourselves at startup.
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    // Never reuse originalname: it is user-controlled and may contain "../".
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      const err = new Error("Only image files are allowed.");
      err.status = 400;
      return cb(err);
    }
    cb(null, true);
  },
});

module.exports = { upload, UPLOAD_DIR };

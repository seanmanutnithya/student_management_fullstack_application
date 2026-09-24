const multer = require("multer");
const path = require("path");
const fs = require("fs");

// One source of truth for where uploads live. Absolute, so it does not depend
// on the directory the server was started from.
const UPLOAD_DIR = path.join(__dirname, "../../uploads");

// Each record type gets its own subfolder: uploads/students, uploads/teachers.
const UPLOAD_FOLDERS = { student: "students", teacher: "teachers" };

// One multer instance per subfolder. `folder` is also what saveAvatar puts in
// the stored URL, so the two always agree.
function createUpload(folder) {
  const dir = path.join(UPLOAD_DIR, folder);

  // multer only creates this for us when `destination` is a string, not a
  // function, so create it ourselves at startup.
  fs.mkdirSync(dir, { recursive: true });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) => {
      // Never reuse originalname: it is user-controlled and may contain "../".
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    },
  });

  return multer({
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
}

const studentUpload = createUpload(UPLOAD_FOLDERS.student);
const teacherUpload = createUpload(UPLOAD_FOLDERS.teacher);

module.exports = { studentUpload, teacherUpload, UPLOAD_DIR, UPLOAD_FOLDERS };

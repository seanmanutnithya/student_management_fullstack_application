const student_managementRoute = require("./src/router/student_managment.route");
const authRoute = require("./src/router/auth.route");
const cardpaywayRoute = require("./src/router/cardpayway.route");

// node modules
const express = require("express");
const cors = require("cors");
const teacherRoute = require("./src/router/teacher.route");
const uploadRoute = require("./src/router/upload.route");

const multer = require("multer");
const { UPLOAD_DIR } = require("./src/middleware/upload");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3000;
app.use("/uploads", express.static(UPLOAD_DIR));

student_managementRoute(app);
authRoute(app);
cardpaywayRoute(app);
teacherRoute(app);
uploadRoute(app);

// Multer rejections arrive here as errors; without this Express returns an HTML
// stack trace and the frontend's res.json() blows up on it.
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE" ?
        "Image must be 5MB or smaller."
      : err.message;
    return res.status(400).json({ status: false, message });
  }
  if (err) {
    return res
      .status(err.status || 500)
      .json({ status: false, message: err.message });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});

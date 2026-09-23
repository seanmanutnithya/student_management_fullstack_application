const Students = require("../../models/Students");
const saveAvatar = require("../../helper/saveAvatar");
const { UPLOAD_FOLDERS } = require("../../middleware/upload");

const uploadStudentImage = async (req, res) => {
  try {
    await saveAvatar({
      Model: Students,
      id: req.params.id,
      file: req.file,
      res,
      label: "Student",
      folder: UPLOAD_FOLDERS.student,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = uploadStudentImage;

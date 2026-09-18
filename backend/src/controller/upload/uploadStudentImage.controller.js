const Students = require("../../models/Students");
const saveAvatar = require("../../helper/saveAvatar");

const uploadStudentImage = async (req, res) => {
  try {
    await saveAvatar({
      Model: Students,
      id: req.params.id,
      file: req.file,
      res,
      label: "Student",
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = uploadStudentImage;

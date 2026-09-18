const Teachers = require("../../models/Teachers");
const saveAvatar = require("../../helper/saveAvatar");

const uploadImage = async (req, res) => {
  try {
    await saveAvatar({
      Model: Teachers,
      id: req.params.id,
      file: req.file,
      res,
      label: "Teacher",
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = uploadImage;

const { checkTargetId } = require("../../helper/validate");
const Teachers = require("../../models/Teachers");

const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const index = await checkTargetId(id, "teachers");
    if (index == -1) {
      return res.status(404).json({
        message: "Id not found.",
      });
    }
    const result = await Teachers.destroy({ where: { id } });
    return res.status(200).json({
      status: true,
      message: "Teacher deleted.",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
      message: "Failed to delete teacher.",
    });
  }
};

module.exports = deleteTeacher;

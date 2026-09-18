const { checkTargetId } = require("../../helper/validate");
const Teachers = require("../../models/Teachers");

const updateTeacher = async (req, res) => {
  try {
    const targetId = req.params.targetId;
    const index = await checkTargetId(targetId, "teachers");
    if (index == -1) {
      return res.status(404).json({
        index,
        targetId,
        message: "Teacher not found.",
      });
    }
    const {
      id,
      name,
      email,
      phone,
      subject,
      dept,
      exp,
      type,
      qualification,
      joinDate,
      address,
      avatar,
    } = req.body;

    const teacherData = {
      id,
      name,
      email,
      phone,
      subject,
      dept,
      exp,
      type,
      qualification,
      joinDate,
      address,
      avatar,
    };
    await Teachers.update({ ...teacherData }, { where: { id: targetId } });
    res.status(200).json({
      status: true,
      message: "Updated successfuly.",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
      message: "Failed to update.",
    });
  }
};
module.exports = updateTeacher;

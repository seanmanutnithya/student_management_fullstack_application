const { missingValues, checkTargetId } = require("../../helper/validate");
const Teachers = require("../../models/Teachers");

const addNewTeacher = async (req, res) => {
  try {
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
    } = req.body;

    const index = await checkTargetId(id, "teachers");

    if (index !== -1) {
      return res.status(400).json({
        status: false,
        message: "Teacher's Id already exists.",
        fields: ["id"],
        reason: "duplicate",
      });
    }
    const fields = {
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
    };
    const missing = missingValues(fields);
    if (missing.length > 0) {
      const fields = missing.map(([key]) => key);
      return res.status(400).json({
        status: false,
        message: `${fields.join(", ")} is required!`,
        fields,
        reason: "missing",
      });
    }

    // avatar starts empty; POST /teacher/:id/avatar sets it after the upload.
    const teacher = { ...fields, avatar: "" };

    const result = await Teachers.create(teacher);

    return res.status(200).json({
      status: true,
      message: "Teacher added.",
      teacher: result.json,
    });
  } catch (error) {
    res.status(404).json({
      status: false,
      error,
    });
  }
};

module.exports = addNewTeacher;

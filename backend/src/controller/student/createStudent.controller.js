const Students = require("../../models/Students");
const { missingValues } = require("../../helper/validate");
const logs_error = require("../../helper/logs_error");
const sendTelegramMessage = require("../../helper/sendTelegramMessage");
const createStudent = async (req, res) => {
  try {
    const {
      id,
      name,
      gender,
      std_class,
      phone,
      dob,
      email,
      address,
      guardianName,
      guardianPhone,
      remark,
    } = req.body;

    // Every one of these is NOT NULL in the table; omitting them let MySQL fall
    // back to implicit defaults, which collided on the UNIQUE empty email.
    const field = {
      id,
      name,
      gender,
      std_class,
      phone,
      dob,
      email,
      address,
      guardianName,
      guardianPhone,
    };
    const missing = await missingValues(field);
    if (missing.length > 0) {
      return res.status(400).json({
        message: `${missing.map(([key]) => key).join(", ")} is required!`,
      });
    }
    const student = { ...field, remark: remark || null };
    await Students.create(student);

    const message = `
      🆕 <b>New Student Registered</b>
          <b>ID:</b> <code>${student.id}</code>
          <b>Name:</b> ${student.name}
          <b>Gender:</b> ${student.gender}
          <b>Class:</b> ${student.std_class}
          <b>Phone:</b> <code>${student.phone}</code>
    `.trim();
    await sendTelegramMessage(message);
    res.status(200).json({
      student,
    });
  } catch (error) {
    // A unique-constraint failure reports its message as the opaque
    // "Validation error"; the column that actually collided is in `errors`.
    const detail =
      error.errors?.map((e) => e.message).join(", ") || error.message;
    logs_error(`${error.name}: ${detail}\n`);

    const isBadInput =
      error.name === "SequelizeUniqueConstraintError" ||
      error.name === "SequelizeValidationError";
    res
      .status(isBadInput ? 400 : 500)
      .json({ status: false, message: detail });
  }
};

module.exports = createStudent;

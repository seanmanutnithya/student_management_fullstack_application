const Students = require("../../models/Students");
const { missingValues } = require("../../helper/validate");
const logs_error = require("../../helper/logs_error");
const sendTelegramMessage = require("../../helper/sendTelegramMessage");
const createStudent = async (req, res) => {
  try {
    const { id, name, gender, std_class, phone } = req.body;
    const field = { id, name, gender, std_class, phone };
    const missing = await missingValues(field);
    if (missing.length > 0) {
      return res.status(404).send({
        message: `${missing.map(([key]) => key).join(", ")} is required!`,
      });
    }
    const student = {
      id,
      name,
      gender,
      std_class,
      phone,
    };
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
    res.send({
      student,
    });
  } catch (error) {
    const content = error.message;
    logs_error(content + "\n");
    res.send({ status: false, message: content });
  }
};

module.exports = createStudent;

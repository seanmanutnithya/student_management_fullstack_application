const { studentDB } = require("../../config/config");
const logs_error = require("../../helper/logs_error");
const sendTelegramMessage = require("../../helper/sendTelegramMessage");
const createStudent = async (req, res) => {
  const mysql = `
    INSERT INTO students (id, name, gender, std_class, phone, image_url) VALUES
    (?,?,?,?,?,?);
  `;
  try {
    const field = ({ id, name, gender, std_class, phone, image_url } =
      req.body);
    await studentDB.query(mysql, [
      id,
      name,
      gender,
      std_class,
      phone,
      image_url,
    ]);
    const student = {
      id,
      name,
      gender,
      std_class,
      phone,
      image_url,
    };
    const message = `
      🆕 <b>New Student Registered</b>
          <b>ID:</b> <code>${student.id}</code>
          <b>Name:</b> ${student.name}
          <b>Gender:</b> ${student.gender}
          <b>Class:</b> ${student.studnet_class}
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

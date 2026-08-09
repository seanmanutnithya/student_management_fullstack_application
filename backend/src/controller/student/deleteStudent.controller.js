const { studentDB } = require("../../config/config");
const { checkTargetId } = require("../../helper/validate");

const logs_error = require("../../helper/logs_error");
const sendTelegramMessage = require("../../helper/sendTelegramMessage");
const fetchAllData = require("../../helper/fetchAllData");

const deleteStudent = async (req, res) => {
  try {
    const sql = `DELETE FROM students WHERE students.id=?`;
    const targetId = req.params.targetId;
    const index = await checkTargetId(targetId);
    if (index == -1) {
      return res.status(404).send({
        status: false,
        message: "TargetId not found!",
      });
    }
    const students = await fetchAllData("students");
    const student = students[index];

    await studentDB.query(sql, [targetId]);

    const message = `
    ❌ <b>Student removed!</b>
        <b>ID:</b> <code>${student.id}</code>
        <b>Name:</b> ${student.name}
        <b>Gender:</b> ${student.gender}
        <b>Class:</b> ${student.std_class}
        <b>Phone:</b> <code>${student.phone}</code>
        <b>Class:</b> ${student.image_url}
        <b>Class:</b> ${student.remark}
    `.trim();
    await sendTelegramMessage(message);

    res.send({
      status: true,
      message: "Deleted student!",
      student,
    });
  } catch (error) {
    const content = error.message;
    logs_error(content + "\n");
    res.status(500).send({
      status: false,
      message: content,
    });
  }
};

module.exports = deleteStudent;

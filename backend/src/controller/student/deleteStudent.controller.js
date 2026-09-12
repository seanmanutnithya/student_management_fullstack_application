const Students = require("../../models/Students");
const { checkTargetId } = require("../../helper/validate");

const logs_error = require("../../helper/logs_error");
const sendTelegramMessage = require("../../helper/sendTelegramMessage");
const fetchAllData = require("../../helper/fetchAllData");

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Students.findByPk(id);
    if (!Students) {
      return res.status(404).send({
        stats: false,
        message: "Student not found",
      });
    }
    const result = await student.destroy(id);

    const message = `
    ❌ <b>Student Removed!</b>
        <b>ID:</b> <code>${result.id}</code>
        <b>Name:</b> ${result.name}
        <b>Gender:</b> ${result.gender}
        <b>Class:</b> ${result.std_class}
        <b>Phone:</b> <code>${result.phone}</code>
        <b>Remark:</b> ${result.remark}
    `.trim();
    await sendTelegramMessage(message);
    res.send({
      status: true,
      message: "Deleted student!",
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

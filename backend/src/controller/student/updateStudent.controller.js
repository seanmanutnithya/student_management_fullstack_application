const { studentDB } = require("../../config/config");
const { checkTargetId } = require("../../helper/validate");

const logs_error = require("../../helper/logs_error");
const sendTelegramMessage = require("../../helper/sendTelegramMessage");

const udpateStudent = async (req, res) => {
  try {
    const sql = `
        UPDATE students SET id=?,name=?,gender=?,std_class=?,phone=?,remark=? 
        WHERE students.id=?        
    `;
    const targetId = req.params.targetId;
    const field = ({ id, name, gender, std_class, phone, remark } = req.body);

    const index = await checkTargetId(targetId);
    if (index == -1) {
      return res.status(404).send({
        status: false,
        message: "TargetId not found!",
      });
    }

    await studentDB.query(sql, [
      id,
      name,
      gender,
      std_class,
      phone,
      remark,
      targetId,
    ]);

    const student = {
      id,
      name,
      gender,
      std_class,
      phone,
      remark,
    };

    const message = `
    ✅ <b>Student Updated!</b>
        <b>ID:</b> <code>${student.id}</code>
        <b>Name:</b> ${student.name}
        <b>Gender:</b> ${student.gender}
        <b>Class:</b> ${student.std_class}
        <b>Phone:</b> <code>${student.phone}</code>
    `.trim();

    await sendTelegramMessage(message);

    res.send({
      status: true,
      message: "updated student!",
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

module.exports = udpateStudent;

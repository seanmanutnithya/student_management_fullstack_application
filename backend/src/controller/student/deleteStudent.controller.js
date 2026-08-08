const { studentDB } = require("../../config/config");
const logs_error = require("../../helper/logs_error");
const { checkTargetId } = require("../../helper/validate");

const deleteStudent = async (req, res) => {
  try {
    const sql = `DELETE FROM students WHERE students.id=?`;
    const targetId = req.params.targetId;
    const index = checkTargetId(targetId);
    if (index == -1) {
      return res.status(404).send({
        status: false,
        message: "TargetId not found!",
      });
    }

    await studentDB.query(sql, [targetId]);
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

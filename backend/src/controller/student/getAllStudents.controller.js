const fetchAllStudent = require("../../helper/fetchAllStudents");
const exportToJson = require("../../helper/exprtToJson");
const logs_error = require("../../helper/logs_error");

const getAllStudents = async (req, res) => {
  try {
    const students = await fetchAllStudent();
    res.send({ students });
  } catch (error) {
    const content = error.message;
    logs_error(content + "\n");
    res.status(500).send({
      status: false,
      message: content,
    });
  }
};

module.exports = getAllStudents;

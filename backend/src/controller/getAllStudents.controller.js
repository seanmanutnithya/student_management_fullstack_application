const fetchAllStudent = require("../helper/fetchAllStudents");
const exportToJson = require("../helper/exprtToJson");

const getAllStudents = async (req, res) => {
  try {
    const students = await fetchAllStudent();
    res.send({ students, s });
  } catch (error) {
    const content = error.message;
    res.status(500).send({
      status: false,
      message: content,
    });
  }
};

module.exports = getAllStudents;

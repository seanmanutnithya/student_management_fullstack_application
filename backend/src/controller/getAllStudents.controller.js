const fetchAllStudent = require("../helper/fetchAllStudents");

const getAllStudents = async (req, res) => {
  const students = await fetchAllStudent();
  res.send({ students });
};

module.exports = getAllStudents;

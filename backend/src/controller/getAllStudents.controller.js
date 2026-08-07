const fetchAllStudent = require("../helper/fetchAllStudents");
const exportToJson = require("../helper/exprtToJson");

const getAllStudents = async (req, res) => {
  await exportToJson();
  const students = await fetchAllStudent();
  res.send({ students });
};

module.exports = getAllStudents;

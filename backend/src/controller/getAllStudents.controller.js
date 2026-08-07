const fetchAllStudent = require("../helper/fetchAllStudents");
const exportToJson = require("../helper/exprtToJson");

const getAllStudents = async (req, res) => {
  const field = ({ name, age } = req.body);
  await exportToJson();
  const students = await fetchAllStudent();
  res.send({ students });
};

module.exports = getAllStudents;

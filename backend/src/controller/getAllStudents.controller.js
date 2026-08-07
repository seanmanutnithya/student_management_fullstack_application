const fetchAllStudent = require("../helper/fetchAllStudents");
const getAllStudents = async (req, res) => {
  res.send({ message: "get all student successfuly" });
};

module.exports = getAllStudents;

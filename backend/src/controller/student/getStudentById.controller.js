const fetchAllData = require("../../helper/fetchAllData");
const Students = require("../../models/Students");

const { checkTargetId, missingValues } = require("../../helper/validate");
const getStudentById = async (req, res) => {
  const { id } = req.params;
  const missing = await missingValues(id);
  if (missing.length > 0) {
    return res.status(404).send({
      message: `${missing.map(([key]) => key).join(", ")} is required!`,
    });
  }
  const student = await Students.findByPk(id);
  if (!student) {
    return res.status(404).send({
      error: "Student not found",
    });
  }
  res.send({
    student,
  });
};

module.exports = getStudentById;

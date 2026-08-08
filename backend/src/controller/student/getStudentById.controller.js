const fetchAllData = require("../../helper/fetchAllData");
const { checkTargetId } = require("../../helper/validate");
const getStudentById = async (req, res) => {
  const targetId = req.params.targetId;
  const students = await fetchAllData("students");
  const index = await checkTargetId(res, targetId);

  const student = students[index];
  res.send({
    student,
  });
};

module.exports = getStudentById;

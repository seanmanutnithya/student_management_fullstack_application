const fetchAllData = require("../../helper/fetchAllData");
const { checkTargetId } = require("../../helper/validate");
const getStudentById = async (req, res) => {
  const targetId = req.params.targetId;
  const students = await fetchAllData("students");

  const index = await checkTargetId(targetId);
  if (index == -1) {
    return res.status(404).send({
      status: false,
      message: "TargetId not found!",
    });
  }
  const student = students[index];
  res.send({
    student,
  });
};

module.exports = getStudentById;

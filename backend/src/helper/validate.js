const fetchAllStudent = require("./fetchAllData");
async function missingValues(res, field) {
  const missing = Object.entries(field).filter(([key, value]) =>
    value == "" ? true
    : value == null ? true
    : false,
  );
  if (missing.length > 0) {
    return res.status(404).send({
      message: `${missing.map(([key]) => key).join(", ")} is required!`,
    });
  }
}

async function checkTargetId(res, targetId) {
  const students = await fetchAllStudent("students");

  const index = await students.findIndex((idx) => idx.id == targetId);
  if (index == -1) {
    return res.status(404).send({
      status: false,
      message: "TargetId not found!",
    });
  }
  return index;
}

module.exports = { missingValues, checkTargetId };

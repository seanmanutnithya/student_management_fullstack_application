const fetchAllData = require("./fetchAllData");
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

async function checkTargetId(targetId) {
  const students = await fetchAllData("students");

  const index = await students.findIndex((idx) => idx.id == targetId);

  return index;
}

async function checkEmail(res, email) {
  const users = await fetchAllData("auths");

  const index = await users.findIndex((idx) => idx.email === email);
  if (index == -1) {
    return res.status(404).send({
      status: false,
      message: "this account doesn't exist, singup instead!",
    });
  }

  return index;
}

module.exports = { missingValues, checkTargetId, checkEmail };

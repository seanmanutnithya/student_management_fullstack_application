const fetchAllData = require("./fetchAllData");
function missingValues(field) {
  const missing = Object.entries(field).filter(([key, value]) =>
    value == "" ? true
    : value == null ? true
    : false,
  );

  return missing;
}

async function checkTargetId(targetId) {
  const students = await fetchAllData("students");

  const index = await students.findIndex((idx) => idx.id == targetId);

  return index;
}

async function checkEmail(email) {
  const users = await fetchAllData("auths");

  const index = await users.findIndex((idx) => idx.email === email);

  return index;
}

module.exports = { missingValues, checkTargetId, checkEmail };

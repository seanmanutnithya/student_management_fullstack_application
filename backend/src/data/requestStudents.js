const fetchAllData = require("../helper/fetchAllData");
async function requestStudents() {
  return await fetchAllData("students");
}
module.exports = requestStudents;

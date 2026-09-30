const fetchAllData = require("../helper/fetchAllData");

async function requestTeachers() {
  return await fetchAllData("teachers");
}
module.exports = requestTeachers;

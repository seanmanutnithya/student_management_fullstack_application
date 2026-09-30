const fetchAllData = require("../helper/fetchAllData");

async function requestFees() {
  return await fetchAllData("fees");
}
module.exports = requestFees;

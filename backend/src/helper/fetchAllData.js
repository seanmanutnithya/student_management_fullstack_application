const { studentDB } = require("../config/config");

async function fetchAllData(table) {
  const sql = `SELECT * FROM ??`;
  const result = await studentDB.query(sql, [table]);
  return result[0];
}
module.exports = fetchAllData;

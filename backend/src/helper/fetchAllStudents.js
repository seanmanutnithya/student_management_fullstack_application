const { studentDB } = require("../config/config");

async function fetchAllStudent() {
  const sql = `SELECT * FROM students`;
  const result = await studentDB.query(sql);
  return result[0];
}
module.exports = fetchAllStudent;

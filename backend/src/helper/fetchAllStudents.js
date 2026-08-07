const db = require("../config/config");

async function fetchAllStudent() {
  const sql = `SELECT * FROM students`;
  const result = await db.query(sql);
  return result[0];
}
module.exports = fetchAllStudent;

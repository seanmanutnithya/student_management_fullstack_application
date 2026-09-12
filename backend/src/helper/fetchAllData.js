const { studentDB, authDB } = require("../config/config");

const dbByTable = {
  students: studentDB,
  auths: authDB,
};

async function fetchAllData(table) {
  const db = dbByTable[table];
  const sql = `SELECT * FROM ??`;
  const result = await db.query(sql, [table]);
  return result[0];
}
module.exports = fetchAllData;

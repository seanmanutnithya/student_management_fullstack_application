const fetchAllStudent = require("./fetchAllData");

const fs = require("fs");
const path = require("path");

async function exportToJson() {
  const row = await fetchAllStudent("students");
  const filePath = path.join(__dirname, "../../../database/data.json");
  await fs.writeFileSync(filePath, JSON.stringify(row, null, 2));
}
module.exports = exportToJson;

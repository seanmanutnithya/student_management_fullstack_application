const fs = require("fs");
const path = require("path");

function getLocalDate() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const fullDate = `${year}-${month}-${day}`;

  return fullDate;
}

function logs_error(content) {
  const fullDate = getLocalDate();
  const fileName = `${fullDate}_logs_error.txt`;
  const dirPath = path.join(__dirname, "../../logs/");
  const filePath = path.join(dirPath, fileName);

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  fs.appendFile(filePath, content, (err) => {
    if (err) console.error("failed to write to file!", err);
  });
}

module.exports = logs_error;

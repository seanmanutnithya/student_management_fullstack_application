const mysql = require("mysql2/promise");
const studentDB = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "student_management",
});

module.exports = { studentDB };

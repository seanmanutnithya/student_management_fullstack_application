const mysql = require("mysql2/promise");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const STUDNET_DB_HOST = process.env.STUDNET_DB_HOST;
const STUDNET_DB_USER = process.env.STUDNET_DB_USER;

const studentDB = mysql.createPool({
  host: STUDNET_DB_HOST,
  user: STUDNET_DB_USER,
  password: "",
  database: "student_management",
});

module.exports = { studentDB };

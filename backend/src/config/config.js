const mysql = require("mysql2/promise");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const STUDENT_DB_HOST = process.env.STUDENT_DB_HOST;
const STUDENT_DB_USER = process.env.STUDENT_DB_USER;

const AUTH_DB_HOST = process.env.AUTH_DB_HOST;
const AUTH_DB_USER = process.env.AUTH_DB_USER;

const TEACHER_DB_HOST = process.env.TEACHER_DB_HOST;
const TEACHER_DB_USER = process.env.TEACHER_DB_USER;

const studentDB = mysql.createPool({
  host: STUDENT_DB_HOST,
  user: STUDENT_DB_USER,
  password: "",
  database: "student_management",
});

const authDB = mysql.createPool({
  host: AUTH_DB_HOST,
  user: AUTH_DB_USER,
  password: "",
  database: "auth_management",
});

const teachersDB = mysql.createPool({
  host: TEACHER_DB_HOST,
  user: TEACHER_DB_USER,
  password: "",
  database: "student_management",
});

module.exports = { studentDB, authDB, teachersDB };

const { Sequelize } = require("sequelize");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "../../../.env") });

const sequelizeStudentDb = new Sequelize(
  process.env.STUDENT_DB_NAME,
  process.env.STUDENT_DB_USER,
  process.env.STUDENT_DB_PASSWORD || "",
  {
    host: process.env.STUDENT_DB_HOST,
    port: process.env.STUDENT_DB_PORT,
    dialect: "mysql",
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
);

async function testConnection() {
  try {
    await sequelizeStudentDb.authenticate();
    console.log("Database connection established successfully");
  } catch (error) {
    console.log("undable to connect to databse", error);
  }
}

testConnection();

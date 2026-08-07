const getAllStudents = require("../controller/getAllStudents.controller");

const student_managementRoute = (app) => {
  app.get("/api/v1/student/get/all", getAllStudents);
};

module.exports = student_managementRoute;

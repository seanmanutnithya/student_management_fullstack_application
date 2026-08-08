const createStudent = require("../controller/createStudent.controller");
const getAllStudents = require("../controller/getAllStudents.controller");
const udpateStudent = require("../controller/updateStudent.controller");

const student_managementRoute = (app) => {
  app.get("/api/v1/student/get/all", getAllStudents);
  app.post("/api/v1/student/create", createStudent);
  app.put("/api/v1/student/update/:targetId", udpateStudent);
};

module.exports = student_managementRoute;

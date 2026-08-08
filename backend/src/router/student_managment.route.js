const createStudent = require("../controller/createStudent.controller");
const getAllStudents = require("../controller/getAllStudents.controller");
const udpateStudent = require("../controller/updateStudent.controller");
const deleteStudent = require("../controller/deleteStudent.controller");
const student_managementRoute = (app) => {
  app.get("/api/v1/student/get/all", getAllStudents);
  app.post("/api/v1/student/create", createStudent);
  app.put("/api/v1/student/update/:targetId", udpateStudent);
  app.delete("/api/v1/student/delete/:targetId", deleteStudent);
};

module.exports = student_managementRoute;

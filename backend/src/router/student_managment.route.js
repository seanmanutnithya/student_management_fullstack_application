const getAllStudents = require("../controller/student/getAllStudents.controller");
const getStudentById = require("../controller/student/getStudentById.controller");
const createStudent = require("../controller/student/createStudent.controller");
const udpateStudent = require("../controller/student/updateStudent.controller");
const deleteStudent = require("../controller/student/deleteStudent.controller");
const validate_token = require("../middleware/auth");

const student_managementRoute = (app) => {
  app.get("/api/v1/student/get/:targetId", getStudentById);
  app.post("/api/v1/student/create", createStudent);
  app.put("/api/v1/student/update/:targetId", udpateStudent);
  app.delete("/api/v1/student/delete/:targetId", deleteStudent);
};

module.exports = student_managementRoute;

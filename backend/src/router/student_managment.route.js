const getAllStudents = require("../controller/student/getAllStudents.controller");
const getStudentById = require("../controller/student/getStudentById.controller");
const createStudent = require("../controller/student/createStudent.controller");
const udpateStudent = require("../controller/student/updateStudent.controller");
const deleteStudent = require("../controller/student/deleteStudent.controller");
const validate_token = require("../middleware/auth");

const student_managementRoute = (app) => {
  app.get("/api/v1/student/get/all", validate_token(), getAllStudents);
  app.get("/api/v1/student/get/:targetId", getStudentById);
  app.post("/api/v1/student/create", validate_token(), createStudent);
  app.put("/api/v1/student/update/:targetId", validate_token(), udpateStudent);
  app.delete(
    "/api/v1/student/delete/:targetId",
    validate_token(),
    deleteStudent,
  );
};

module.exports = student_managementRoute;

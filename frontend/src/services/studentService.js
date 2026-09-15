import api from "./axiosInstance";

// createStudent.controller.js reads these off req.body directly, and the
// Students model has no column for the rest of the form — including `avatar`,
// which would otherwise ship a base64 blob on every create.
const STUDENT_COLUMNS = ["id", "name", "gender", "std_class", "phone", "remark"];

export async function handleFetchAllStudentData() {
  const res = await api.get("/student/get/all");

  return res.data;
}

export async function handleCreateStudent(studentData) {
  const body = Object.fromEntries(
    STUDENT_COLUMNS.filter((key) => studentData?.[key] != null).map((key) => [
      key,
      studentData[key],
    ]),
  );

  const res = await api.post("/student/create", body);
  return res.data;
}

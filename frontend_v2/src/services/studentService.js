import api from "./axiosInstance";

// createStudent.controller.js reads these off req.body directly. All but
// `remark` are NOT NULL in the students table, so every one has to be sent.
// `avatar` is deliberately absent: it is set by POST /student/:id/avatar, which
// stores the upload path. Sending it here would overwrite that with form state.
const STUDENT_COLUMNS = [
  "id",
  "name",
  "gender",
  "std_class",
  "phone",
  "dob",
  "email",
  "address",
  "guardianName",
  "guardianPhone",
  "remark",
];

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

export async function handleDeleteStudent(id) {
  const res = await api.delete(`/student/delete/${id}`);
  return res.data;
}

export async function handleMultipleDelete(selectedIds) {
  const res = await Promise.allSettled(
    selectedIds.map((id) => handleDeleteStudent(id)),
  );
  return res.map((r, i) => ({
    id: selectedIds[i],
    ok: r.status === "fulfilled" && r.value?.status === true,
  }));
}

export async function handleEditStudent(id, studentData) {
  const body = Object.fromEntries(
    STUDENT_COLUMNS.filter((key) => studentData?.[key] != null).map((key) => [
      key,
      studentData[key],
    ]),
  );

  // The route is registered with app.put — a POST here 404s.
  const res = await api.put(`/student/update/${id}`, body);
  return res.data;
}

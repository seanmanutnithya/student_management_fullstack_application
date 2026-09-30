import api from "./axiosInstance";

// export async function handleAddNewTeacher() {
//   const res = await api.post("");
//   return res.data;
// }

// `avatar` is deliberately absent: it is set by POST /teacher/:id/avatar, which
// stores the upload path. Sending it here would overwrite that with form state.
const TEACHER_COLUMNS = [
  "id",
  "name",
  "email",
  "phone",
  "subject",
  "dept",
  "exp",
  "type",
  "qualification",
  "joinDate",
  "address",
];

export async function getAllTeachers() {
  try {
    const res = await api.get("/teacher/get/all");
    return res.data;
  } catch (error) {
    console.error(error.message);
  }
}

export async function handleDeleteTeacher(targetId) {
  try {
    const res = await api.delete(`/teacher/delete/${targetId}`);

    return res.data;
  } catch (error) {
    console.error(error);
  }
}

const toTeacherBody = (teacherData) =>
  Object.fromEntries(
    TEACHER_COLUMNS.filter((key) => teacherData?.[key] != null).map((key) => [
      key,
      teacherData[key],
    ]),
  );

// Throws so the form can show the backend's validation message.
export async function handleEditTeacher(targetId, teacherData) {
  const res = await api.put(
    `teacher/update/${targetId}`,
    toTeacherBody(teacherData),
  );
  return res.data;
}

export async function handleCreateTeacher(teacherData) {
  const res = await api.post("teacher/create", toTeacherBody(teacherData));
  return res.data;
}

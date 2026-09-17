import api from "./axiosInstance";

// export async function handleAddNewTeacher() {
//   const res = await api.post("");
//   return res.data;
// }

export async function getAllTeachers() {
  try {
    const res = await api.get("/teacher/get/all");
    return res.data;
  } catch (error) {
    console.error(error.message);
  }
}

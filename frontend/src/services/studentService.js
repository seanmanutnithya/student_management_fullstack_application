import api from "./axiosInstance";

export async function handleFetchAllStudentData() {
  const res = await api.get("/student/get/all");

  return res.data;
}

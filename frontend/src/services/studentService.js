import api from "./axiosInstance";

export async function handleFetchAllStudentData() {
  const res = await api.get("/student/get/all");

  return res.data;
}

export async function handleCreateStudent({ studentData }) {
  const res = await api.post("/student/create", {
    studentData,
  });
  console.log(res.data);
  return res.data;
}

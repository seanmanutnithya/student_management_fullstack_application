import api from "./axiosInstance";
export async function getHomeData() {
  const res = await api.get("/home/data");

  return res.data;
}

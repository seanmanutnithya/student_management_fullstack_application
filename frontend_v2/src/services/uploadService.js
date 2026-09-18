import api from "./axiosInstance";

// Content-Type must be undefined here: axios only generates the multipart
// boundary when the header is unset, and the shared instance defaults it to
// application/json, which makes multer see no file.
async function postAvatar(url, file) {
  const formData = new FormData();
  formData.append("avatar", file); // must match upload.single("avatar")

  const res = await api.post(url, formData, {
    headers: { "Content-Type": undefined },
  });

  return res.data;
}

export function handleUploadImage(file, teacherId) {
  return postAvatar(`/teacher/${teacherId}/avatar`, file);
}

export function handleUploadStudentImage(file, studentId) {
  return postAvatar(`/student/${studentId}/avatar`, file);
}

const fetchAllData = require("../helper/fetchAllData");

async function getStudentSummary() {
  const prevStudents = 15;
  const students = await fetchAllData("students");
  const totalStudent = await students.length;
  const currentTrend = await calPercentage(prevStudents, totalStudent);

  return { totalStudent, currentTrend };
}

async function getTeacherSummary() {
  const prevTeacher = 15;
  const teachers = await fetchAllData("teachers");
  const totalTeacher = teachers.length;
  const currentTrend = await calPercentage(prevTeacher, totalTeacher);

  return { totalTeacher, currentTrend };
}

async function getAttendancSummary() {
  const preAbsent = 10;
  const absentStudent = 10;
  const { totalStudent } = await getStudentSummary();
  const attendanceRate = await calPercentage(totalStudent, absentStudent);
  const currentTrend = await calPercentage(preAbsent, absentStudent);

  return { attendanceRate, currentTrend };
}

async function getFeeSummary() {
  const prevFee = 16000;

  const remainingStudent = 10;
  const fee = 800;

  const totalFee = remainingStudent * fee;
  const currentTrend = await calPercentage(prevFee, totalFee);

  return { totalFee, currentTrend };
}
// (1600 - 12 * 800)
async function calPercentage(prev, cur) {
  return Number((((cur - prev) * 100) / prev).toFixed(2));
}

async function checkTrendState(trend) {
  if (trend < 0) return false;
  if (trend > 0) return true;
}

module.exports = {
  getStudentSummary,
  getTeacherSummary,
  getFeeSummary,
  getAttendancSummary,
};

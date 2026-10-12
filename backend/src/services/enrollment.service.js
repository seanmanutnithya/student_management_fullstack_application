const enrollments = require("../models/Enrollment");

async function enrollStd(studentId, year) {
  return enrollments.create({ studentId, academic_year: year });
}
async function unenrollStd(studentId) {
  return enrollments.destroy({
    where: { studentId },
  });
}
async function getStdCount(year) {
  return enrollments.count({ where: { academic_year: year } });
}
module.exports = { enrollStd, unenrollStd, getStdCount };

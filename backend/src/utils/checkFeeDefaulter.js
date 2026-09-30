const dayjs = require("dayjs");
const requestStudents = require("../data/requestStudents");

async function checkFeeDefaulter() {
  const studentData = await requestStudents();
  const currentDate = dayjs().format("DD-MMM-YYYY");
  const currentYear = dayjs().get("year");
  const payDate = `20-Sep-${currentYear}`;

  
}
module.exports = checkFeeDefaulter;

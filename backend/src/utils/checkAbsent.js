const fetchAllData = require("../helper/fetchAllData");

async function checkAbsent() {
  const studentData = await fetchAllData("students");
  const absentList = Object.fromEntries(
    studentData.map((s) => [
      s.id,
      { id: s.id, name: s.name, avatar: s.avatar, absent: s.absent },
    ]),
  );

  const sorted = Object.values({ ...absentList }).sort(
    (a, b) => b.absent - a.absent,
  );

  const top5 = [...sorted.slice(0, 5)];
  // const topAbsentStudent
  return top5;
}
module.exports = checkAbsent;

const { getStdCount } = require("../../services/enrollment.service");
const {
  getStudentSummary,
  getTeacherSummary,
  getFeeSummary,
  getAttendancSummary,
} = require("../../utils/getHomeData");

const homeData = async (req, res) => {
  try {
    const fee = await getFeeSummary();
    const attendant = await getAttendancSummary();
    const teacher = await getTeacherSummary();
    const student = await getStudentSummary();
    const enrCount = await getStdCount(2025);
    return res.status(200).json({
      fee,
      att: attendant,
      teacher,
      std: student,
    });
  } catch (error) {
    return res.json({ error });
  }
};

module.exports = homeData;

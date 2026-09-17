const fetchAllData = require("../../helper/fetchAllData");

const getAllTeachers = async (req, res) => {
  try {
    const teachers = await fetchAllData("teachers");

    return res.status(200).json({
      teachers,
    });
  } catch (error) {
    res.status(404).json({
      error: error.message,
    });
  }
};

module.exports = getAllTeachers;

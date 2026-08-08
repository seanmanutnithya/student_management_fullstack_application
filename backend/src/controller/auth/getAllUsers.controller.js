const { authDB } = require("../../config/config");
const fetchAllData = require("../../helper/fetchAllData");
const logs_error = require("../../helper/logs_error");
const getAllUsers = async (req, res) => {
  try {
    const auths = await fetchAllData("auths");
    res.send({
      auths,
    });
  } catch (error) {
    const content = error.message;
    logs_error(content + "\n");
    res.status(500).send({
      status: false,
      message: content,
    });
  }
};

module.exports = getAllUsers;

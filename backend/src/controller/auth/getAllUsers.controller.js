const { authDB } = require("../../config/config");
const fetchAllData = require("../../helper/fetchAllData");
const getAllUsers = async (req, res) => {
  const auths = await fetchAllData("auths");
  res.send({
    auths,
  });
};

module.exports = getAllUsers;

const { authDB } = require("../../config/config");
const {
  getPendingCode,
  removePendingCode,
} = require("../../global/storePendingCode");
const { hashPassword } = require("../../helper/hashPassword");
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const pending = getPendingCode(email);

    const hashedPassword = await hashPassword(newPassword);
    const sql = `
        UPDATE auths SET password=? WHERE email=?
    `;
    await authDB.query(sql, [hashedPassword, email]);
    return res.send({
      status: true,
      message: "New password is updated!",
    });
  } catch (error) {
    res.status(404).send({
      status: false,
      message: error.message,
    });
    console.error(error);
  }
};
module.exports = resetPassword;

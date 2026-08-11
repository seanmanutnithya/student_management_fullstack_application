const { authDB } = require("../../config/config");
const {
  getPendingCode,
  removePendingCode,
} = require("../../global/storePendingCode");
const { hashPassword } = require("../../helper/hashPassword");
const resetPassword = async (req, res) => {
  try {
    const { email, otpCode, newPassword } = req.body;
    const pending = getPendingCode(email);
    if (!pending.verifyCode) {
      return res.json({
        status: false,
        message: "OTP not found or expired!",
      });
    }
    if (pending.expiresAt < Date.now()) {
      removePendingCode(email);
      return res.json({
        status: false,
        message: "OTP has expired!",
      });
    }
    if (pending.verifyCode !== String(otpCode).trim()) {
      return res.json({
        status: false,
        message: "Invalid otp!",
      });
    }
    const hashedPassword = await hashPassword(newPassword);
    const sql = `
        UPDATE auths SET password=? WHERE email=?
    `;
    await authDB.query(sql, [hashedPassword, email]);
    removePendingCode(email);
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

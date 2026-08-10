const {
  getPendingCode,
  removePendingCode,
} = require("../../global/storePendingCode");
const { authDB } = require("../../config/config");
const { checkEmail } = require("../../helper/validate");

const validateVerifyCode = async (req, res) => {
  try {
    const { email, verifyCode } = req.body;
    const pendingCode = getPendingCode(email);

    if (!pendingCode) {
      return res.status(404).send({
        status: false,
        message: "No verification code found.",
      });
    }
    if (Date.now() > pendingCode.expiresAt) {
      removePendingCode(email);
      return res.status(400).send({
        status: false,
        message: "Verification code expired.",
      });
    }
    if (pendingCode.verifyCode !== String(verifyCode).trim()) {
      return res.status(400).send({
        status: false,
        message: "Invalid verification code.",
      });
    }
    if ((await checkEmail(email)) !== -1) {
      removePendingCode(email);
      return res.status(409).send({
        status: false,
        message: "This account already exists.",
      });
    }

    await authDB.query(
      "INSERT INTO auths (user_name, email, password, phone) VALUES (?, ?, ?, ?)",
      [pendingCode.user_name, pendingCode.email, pendingCode.password, pendingCode.phone],
    );
    removePendingCode(email);

    return res.status(201).send({
      status: true,
      message: "Account verified and created.",
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = validateVerifyCode;

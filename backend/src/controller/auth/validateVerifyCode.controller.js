const {
  getPendingCode,
  removePendingCode,
} = require("../../global/storePendingCode");

const { authDB } = require("../../config/config");
const { checkEmail } = require("../../helper/validate");

const validateVerifyCode = async (req, res) => {
  try {
    const { email, verifyCode } = req.body;

    // get pending code
    const pendingCode = getPendingCode(email);
    // check is pending code exists
    if (!pendingCode) {
      return res.status(404).send({
        status: false,
        message: "No verification code found.",
      });
    }
    // check pending code is expire
    if (Date.now() > pendingCode.expiresAt) {
      removePendingCode(email);
      return res.status(400).send({
        status: false,
        message: "Verification code expired.",
      });
    }
    // check pending code is valid
    if (pendingCode.verifyCode !== String(verifyCode).trim()) {
      return res.status(400).send({
        status: false,
        message: "Invalid verification code.",
      });
    }
    // check is email exist
    if ((await checkEmail(email)) !== -1) {
      removePendingCode(email);
      return res.status(409).send({
        status: false,
        message: "This account already exists.",
      });
    }
    // query to database
    const sql =
      "INSERT INTO auths (user_name,email,password,phone) VALUES (?,?,?,?)";
    await authDB.query(sql, [
      pendingCode.user_name,
      pendingCode.email,
      pendingCode.password,
      pendingCode.phone,
    ]);
    // remove pending code from global
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

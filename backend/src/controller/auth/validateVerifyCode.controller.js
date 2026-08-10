const {
  getPendingCode,
  removePendingCode,
} = require("../../global/storePendingCode");
const validateVerifyCode = async (req, res) => {
  const { email, verifyCode } = req.body;
  const pendingCodes = getPendingCode(email);
  if (!pendingCodes) {
    return res.status(404).send({
      status: false,
      message: "No verification code found.",
    });
  }
  if (Date.now() > pendingCodes.expiresAt) {
    removePendingCode(email);

    return res.status(400).send({
      status: false,
      message: "Verification code expired.",
    });
  }
  if (pendingCodes.verifyCode !== verifyCode) {
    return res.status(400).send({
      status: false,
      message: "Invalid verification code.",
    });
  }
  removePendingCode(email);

  return res.send({
    status: true,
    message: "Code verified.",
  });
};

module.exports = validateVerifyCode;

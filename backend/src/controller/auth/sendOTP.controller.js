const nodemailer = require("nodemailer");
const generateCode = require("../../utils/generateCode");
const sendVerificationCode = require("../../helper/mailConfig");
const { savePendingCode } = require("../../global/storePendingCode");
const { authDB } = require("../../config/config");
const { missingValues } = require("../../helper/validate");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "../../../.env") });
const sendOTP = async (req, res) => {
  const otpCode = generateCode();
  try {
    const field = ({ email, user } = req.body);
    // check is any var empty
    await missingValues(field);
    savePendingCode(email, otpCode, "forgetPassword", user);
    await sendVerificationCode(otpCode, email, "forgetPassword");

    res.send({
      status: true,
      message: "code sent successfully!",
      user,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Failed to send code!",
    });
  }
};
module.exports = sendOTP;

const { missingValues, checkEmail } = require("../../helper/validate");
const { hashPassword } = require("../../helper/hashPassword");
const { savePendingCode } = require("../../global/storePendingCode");
const generateCode = require("../../utils/generateCode");
const sendVerificationCode = require("../../helper/mailConfig");

const logs_error = require("../../helper/logs_error");
const signup = async (req, res) => {
  try {
    const field = ({ user_name, email, user_password, phone } = req.body);
    //  check missing values
    const missing = missingValues(field);
    if (missing.length > 0) {
      return res.status(404).send({
        message: `${missing.map(([key]) => key).join(", ")} is required!`,
      });
    }

    // check is email already exists
    const index = await checkEmail(email);
    if (index !== -1) {
      return res.status(500).send({
        status: true,
        message: "this account already exist!",
      });
    }

    // hash password
    const password = await hashPassword(user_password);
    // verify code otp
    const verifyCode = generateCode();
    // save to global object
    savePendingCode(email, verifyCode, {
      user_name,
      email,
      password,
      phone,
    });
    // send verify code to admin email
    await sendVerificationCode(verifyCode, email);

    return res.send({
      status: true,
      message: "Verification code sent. Please check your email.",
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

module.exports = signup;

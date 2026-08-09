const { authDB } = require("../../config/config");
const { missingValues, checkEmail } = require("../../helper/validate");

const hashPassword = require("../../helper/hashPassword");
const logs_error = require("../../helper/logs_error");
const signup = async (req, res) => {
  const sql = `
        INSERT INTO auths (user_name,email,password,phone)
        VALUES (?,?,?,?)
    `;
  try {
    const field = ({ user_name, email, user_password, phone } = req.body);
    const missing = missingValues(field);
    if (missing.length > 0) {
      return res.status(404).send({
        message: `${missing.map(([key]) => key).join(", ")} is required!`,
      });
    }

    const index = await checkEmail(email);
    if (index !== -1) {
      return res.status(500).send({
        status: true,
        message: "this account already exist!",
      });
    }

    const password = await hashPassword(user_password);

    await authDB.query(sql, [user_name, email, password, phone]);
    const user = {
      user_name,
      email,
      password,
      phone,
    };
    res.send({
      status: true,
      message: "signup successfully!",
      user,
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

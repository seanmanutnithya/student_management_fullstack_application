const { authDB } = require("../../config/config");
const { missingValues } = require("../../helper/validate");

const logs_error = require("../../helper/logs_error");
const signup = async (req, res) => {
  const sql = `
        INSERT INTO auths (user_name,email,password,phone)
        VALUES (?,?,?,?)
    `;
  try {
    const field = ({ user_name, email, password, phone } = req.body);
    await missingValues(res, field);
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

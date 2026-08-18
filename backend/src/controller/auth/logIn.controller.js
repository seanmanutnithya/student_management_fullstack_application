const { authDB } = require("../../config/config");
const { checkEmail } = require("../../helper/validate");
const { compareHashPassword } = require("../../helper/hashPassword");
const fetchAllData = require("../../helper/fetchAllData");
const Auths = require("../../models/Auths");
const logIn = async (req, res) => {
  try {
    const { log_email, log_password } = req.body;
    const auth = await Auths.findOne({
      where: {
        email: log_email,
      },
    });
    if (!auth) {
      return res.status(404).send({
        status: false,
        message: "this account doesn't exist, singup instead!",
      });
    }

    const index = await checkEmail(log_email);
    const users = await fetchAllData("auths");

    const password = users[index].password;
    const isMatch = await compareHashPassword(log_password, password);
    if (!isMatch) {
      return res.status(401).send({
        status: false,
        message: "invalid email or password!",
      });
    }

    const user_name = users[index].user_name;
    const email = users[index].email;
    const phone = users[index].phone;

    res.send({
      auth: JSON.stringify(auth),
      user_name,
      email,
      password,
      phone,
    });
  } catch (error) {
    const content = error.message;
    res.status(500).send({
      status: false,
      message: content,
    });
  }
};

module.exports = logIn;

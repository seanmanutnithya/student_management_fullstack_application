const { authDB } = require("../../config/config");

const signup = async (req, res) => {
  const mysql = `
        INSERT INTO auths (user_name,email,password,phone)
        VALUES (?,?,?,?)
    `;
};

module.exports = signup;

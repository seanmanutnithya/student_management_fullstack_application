const bcrypt = require("bcrypt");
const saltRounds = 10;

async function hashPassword(user_password) {
  const password = await bcrypt.hash(user_password, saltRounds);

  return password;
}

async function compareHashPassword(log_password, password) {
  const isMatch = await bcrypt.compare(log_password, password);

  return isMatch;
}

module.exports = { hashPassword, compareHashPassword };

const bcrypt = require("bcrypt");
const saltRounds = 10;

async function hashPassword(user_password) {
  const password = await bcrypt.hash(user_password, saltRounds);

  return password;
}

module.exports = hashPassword;

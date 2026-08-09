const bcrypt = require("bcrypt");
const saltRounds = 10;
const myPlaintextPassword = "s0/\/\P4$$w0rD";
const someOtherPlaintextPassword = "not_bacon";

async function hashPassword(user_password) {
  const password = await bcrypt.hash(user_password, saltRounds);

  return password;
}

module.exports = hashPassword;

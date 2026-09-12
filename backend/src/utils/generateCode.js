function generateCode() {
  const verifyCode = Math.floor(1000 + Math.random() * 9000).toString();
  return verifyCode;
}
module.exports = generateCode;

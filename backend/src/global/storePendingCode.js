const pendingCodes = new Map();
function savePendingCode(email, verifyCode, action, user) {
  pendingCodes.set(email, {
    ...user,
    action,
    verifyCode,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });
}

function getPendingCode(email) {
  return pendingCodes.get(email);
}
function removePendingCode(email) {
  pendingCodes.delete(email);
}

module.exports = {
  savePendingCode,
  getPendingCode,
  removePendingCode,
};

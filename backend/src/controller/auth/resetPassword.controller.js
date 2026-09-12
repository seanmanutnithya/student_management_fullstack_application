const { authDB } = require("../../config/config");
const {
  getPendingCode,
  removePendingCode,
} = require("../../global/storePendingCode");
const Auths = require("../../models/Auths");

const { hashPassword } = require("../../helper/hashPassword");
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const auth = await Auths.findOne({
      where: { email },
    });

    const pending = getPendingCode(email);

    if (!auth) {
      return res.status(404).send({
        error: "Invalid user",
      });
    }
    const hashedPassword = await hashPassword(newPassword);
    // const sql = `
    // UPDATE auths SET password=? WHERE email=?
    // `;

    const content = {
      email,
      password: hashedPassword,
    };

    const result = await auth.update(content);

    // await authDB.query(sql, [hashedPassword, email]);
    return res.send({
      status: true,
      message: "New password is updated!",
    });
  } catch (error) {
    res.status(404).send({
      status: false,
      message: error.message,
    });
    console.error(error);
  }
};
module.exports = resetPassword;

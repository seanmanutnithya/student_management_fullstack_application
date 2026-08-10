const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const path = require("path");

const generateCode = require("../utils/generateCode");

dotenv.config({ path: path.join(__dirname, "../../../.env") });
// Create a transporter using SMTP

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.APP_PASSWORD,
  },
});

async function sendVerificationCode(req, res) {
  const verifyCode = generateCode();
  try {
    const { user } = req.body;
    const mailOptions = {
      from: `App Signup Code`,
      to: process.env.ADMIN_GMAIL,
      subject: `Verify code`,
      html: `
        <div style='font-family: Arial, sans-serif; padding: 20px;'>
          <h2>Verify Your Account</h2>
          <h3>From ${user}</h3>
          <p>Use the code below to complete your verification:</p>
          <h1 style='letter-spacing: 4px;'>${verifyCode}</h1>
          <p>This code will expire in 5 minutes. If you didn't request this, you can safely ignore this email.</p>
        </div>`,
    };

    await transporter.sendMail(mailOptions);
    res.send({
      status: true,
      message: "send mail successfully",
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Failed to send mail",
    });
  }
}

module.exports = sendVerificationCode;

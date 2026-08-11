const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const path = require("path");

const generateCode = require("../utils/generateCode");
const validateVerifyCode = require("../controller/auth/validateVerifyCode.controller");

dotenv.config({ path: path.join(__dirname, "../../../.env") });

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER, // second email
    pass: process.env.APP_PASSWORD,
  },
});

async function sendVerificationCode(verifyCode, user) {
  try {
    // send to admin email
    const mailOptions = {
      from: `App Signup Code`,
      to: process.env.ADMIN_GMAIL,
      subject: `Verify code`,
      html: `
        <div style='font-family: Arial, sans-serif; padding: 20px;'>
          <h2>Verify Your Account</h2>
          <h3>Request from ${user}</h3>
          <p>Use the code below to complete your verification:</p>
          <h1 style='letter-spacing: 4px;'>${verifyCode}</h1>
          <p>This code will expire in 5 minutes. If you didn't request this, you can safely ignore this email.</p>
        </div>`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = sendVerificationCode;

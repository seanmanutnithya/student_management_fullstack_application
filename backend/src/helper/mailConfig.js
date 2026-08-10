const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "../../../.env") });
// Create a transporter using SMTP

function generateVerificationCode() {
  const verifyCode = Math.floor(Math.random() * 9000 + 1000).toString;
  return verifyCode;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "manutnithya08@gmail.com",
    pass: process.env.APP_PASSWORD,
  },
});

async function sendVerificationCode(req, res) {
  generateVerificationCode();
  try {
    const { text, html } = req.body;
    const mailOptions = {
      from: "name.teacher@gmail.com",
      to: "manutnithya08@gmail.com",
      subject: "verifycation code",
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
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

const nodemailer = require("nodemailer");
const { authDB } = require("../../config/config");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "../../../.env") });
const sendOTP = async (req, res) => {};
module.exports = sendOTP;

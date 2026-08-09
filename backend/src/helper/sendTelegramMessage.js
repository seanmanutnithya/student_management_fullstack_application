const { TelegramBot } = require("node-telegram-bot-api");
const dotenv = require("dotenv");
const path = require("path");
const logs_error = require("./logs_error");
dotenv.config({ path: path.join(__dirname, "../../../.env") });
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

async function sendTelegramMessage(message) {
  try {
    await bot.sendMessage(CHAT_ID, message, {
      parse_mode: "HTML",
    });
  } catch (error) {
    const content = error.message;
    logs_error(content + "\n");
  }
}

module.exports = sendTelegramMessage;

const path = require("path");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const secret_token = process.env.SECRET_TOKEN;
const payload = {
  user: "admin",
  password: "123",
};
const token = jwt.sign(payload, secret_token, {
  expiresIn: "1h",
});

console.log(token);

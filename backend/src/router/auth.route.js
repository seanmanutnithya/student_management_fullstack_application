const signup = require("../controller/auth/signup.controller");
const logIn = require("../controller/auth/logIn.controller");
const validateVerifyCode = require("../controller/auth/validateVerifyCode.controller");
const sendOTP = require("../controller/auth/sendOTP.controller");
const authRoute = (app) => {
  app.post("/api/v1/auth/login", logIn);
  app.post("/api/v1/auth/signup", signup);

  app.post("/api/v1/auth/signup/verify", validateVerifyCode);
  app.post("/api/v1/auth/send-otp", sendOTP);
};

module.exports = authRoute;

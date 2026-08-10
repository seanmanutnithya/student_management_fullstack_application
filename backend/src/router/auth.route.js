const getAllUsers = require("../controller/auth/getAllUsers.controller");
const signup = require("../controller/auth/signup.controller");
const logIn = require("../controller/auth/logIn.controller");
const validateVerifyCode = require("../controller/auth/validateVerifyCode.controller");
const authRoute = (app) => {
  app.get("/api/v1/auth/get/all", getAllUsers);
  app.post("/api/v1/auth/login", logIn);
  app.post("/api/v1/auth/signup", signup);

  app.post("/api/v1/auth/signup/verify", validateVerifyCode);
};

module.exports = authRoute;

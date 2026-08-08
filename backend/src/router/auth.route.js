const getAllUsers = require("../controller/auth/getAllUsers.controller");
const signup = require("../controller/auth/signup.controller");

const authRoute = (app) => {
  app.get("/api/v1/auth/get/all", getAllUsers);
  app.post("/api/vq/auth/signup", signup);
};

module.exports = authRoute;

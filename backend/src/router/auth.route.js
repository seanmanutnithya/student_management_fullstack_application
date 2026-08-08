const getAllUsers = require("../controller/auth/getAllUsers.controller");

const authRoute = (app) => {
  app.get("/api/v1/auth/get/all", getAllUsers);
};

module.exports = authRoute;

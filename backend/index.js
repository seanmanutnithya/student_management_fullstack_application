const student_managementRoute = require("./src/router/student_managment.route");

// node modules
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3000;

const home = (app) => {
  app.get("/", (req, res) => {
    res.send("hello");
  });
};
home(app);
student_managementRoute(app);

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});

const express = require("express");
const student_managementRoute = require("./src/router/student_managment.route");
const app = express();
app.use(express.json());

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

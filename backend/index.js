const student_managementRoute = require("./src/router/student_managment.route");
const authRoute = require("./src/router/auth.route");

// node modules
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3000;

student_managementRoute(app);
authRoute(app);

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});

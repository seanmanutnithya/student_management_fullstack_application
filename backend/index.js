const express = require("express");

const app = express();
app.use(express.json());

const PORT = 3000;

const home = (app) => {
  app.get("/", (req, res) => {
    res.send("hello");
  });
};
home(app);

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});

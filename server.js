const express = require("express");
require("dotenv").config();
const app = express();
// simple get request
app.get("/", (req, res) => {
  res.send("Social test api");
});
app.listen(process.env.PORT, () => {
  console.log("server is live at port ", process.env.PORT);
});

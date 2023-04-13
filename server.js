const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
// routes
const indexRoutes = require("./routes/indexRoutes");

const app = express();
// middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());

// connect to db
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(
        "connected to db & server is live at port ",
        process.env.PORT
      );
    });
  })
  .catch((error) => {
    console.log(error);
  });

// simple get request
app.get("/", (req, res) => {
  res.send("Social test api");
});
app.use("/api", indexRoutes);

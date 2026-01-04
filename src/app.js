const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const v1Routes = require("./routes/v1");

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use("/api/v1", v1Routes);

module.exports = app;

const express = require("express");
var bodyParser = require("body-parser");
require("dotenv").config();
const { join } = require("path");

const app = express();

var index = require("./routes/index");
var tokenexchange = require("./routes/api/tokenexchange");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());

app.set("view engine", "ejs");
app.use(express.static(join(__dirname, "public")));

app.use("/", index);
app.use("/api", tokenexchange);

process.on("SIGINT", function () {
    process.exit();
  });
  
  module.exports = app;
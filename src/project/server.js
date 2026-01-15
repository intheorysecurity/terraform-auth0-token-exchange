const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const { join } = require("path");

const app = express();

var index = require("./routes/index");
var tokenexchange = require("./routes/api/tokenexchange");

// Heroku/Reverse proxies: needed for correct client IPs + rate limiting.
app.set("trust proxy", 1);
app.disable("x-powered-by");

// Minimal hardening for an internet-exposed demo.
app.use(
  helmet({
    // CSP is easy to break for demos (CDNs/inline scripts). Keep other headers.
    contentSecurityPolicy: false,
  })
);

app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(express.json({ limit: "10kb" }));

app.use(
  "/api",
  rateLimit({
    windowMs: 60 * 1000,
    limit: 60,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  })
);

app.set("view engine", "ejs");
app.use(express.static(join(__dirname, "public")));

app.use("/", index);
app.use("/api", tokenexchange);

process.on("SIGINT", function () {
    process.exit();
  });
  
  module.exports = app;
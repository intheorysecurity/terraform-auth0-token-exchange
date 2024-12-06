const express = require("express");
const app = require("../../server");
const router = express.Router();
var jwt = require("jsonwebtoken");

router.post("/createtoken", async (req, res) => {
  payload = {
    ...req.body,
    audience: "http://localhost:3000",
    issuer: "api-dev",
  };

  var jsonToken = jwt.sign(payload, "password123", { expiresIn: "1h" });

  return res.json(jsonToken);
});

module.exports = router;

router.post("/tokenexchange", async (req, res) => {
  console.log(req.body);
  res.json("ok");
});

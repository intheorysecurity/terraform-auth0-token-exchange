const express = require("express");
const app = require("../../server");
const router = express.Router();
var jwt = require("jsonwebtoken");
var axios = require("axios");

router.post("/createtoken", async (req, res) => {
  payload = {
    ...req.body,
    audience: "http://localhost:3000",
    issuer: "api-dev",
  };

  var jsonToken = jwt.sign(payload, "password123", { expiresIn: "1h" });

  return res.json(jsonToken);
});

router.post("/tokenexchange", async (req, res) => {
  var jsonToken = req.body.jsonToken;
  var options = {
    method: "POST",
    url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
    header: {
      "Content-Type": "application/json",
    },
    data: {
      grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
      subject_token_type: "http://acme.com/legacy-token",
      subject_token: jsonToken,
      client_id: process.env.AUTH0_API_CLIENT_ID,
      client_secret: process.env.AUTH0_API_CLIENT_SECRET,
      audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
      scope: "openid",
    },
  };

  try {
    var { status, data } = await axios(options);
    if (status === 200) {
      res.send({ ...data });
    } else {
      console.log(status);
      res.send({ message: "Error", status: 400 });
    }
  } catch (error) {
    var data = error.response.data
    var status = error.status
    res.send({...data, status});
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
var jwt = require("jsonwebtoken");
var axios = require("axios");

router.post("/createtoken", async (req, res) => {
  const { email, given_name, family_name, sub } = req.body ?? {};
  if (typeof email !== "string" || email.length > 254 || !email.includes("@")) {
    return res.status(400).json({ error: "invalid_email" });
  }

  const payload = {
    // Keep fields demo-friendly and predictable.
    given_name: typeof given_name === "string" ? given_name : undefined,
    family_name: typeof family_name === "string" ? family_name : undefined,
    email,
    // Prefer explicit legacy subject; default to a stable legacy-ish identifier.
    sub: typeof sub === "string" && sub.length ? sub : `legacy|${email}`,
    // Standard claims (we keep prior custom names for backwards readability).
    aud: "http://acme.com/legacy-token",
    iss: "api-dev",
    audience: "http://acme.com/legacy-token",
    issuer: "api-dev",
  };

  if (!process.env.JSON_SECRET) {
    return res.status(500).json({ error: "missing_JSON_SECRET" });
  }

  const jsonToken = jwt.sign(payload, process.env.JSON_SECRET, {
    expiresIn: "1h",
  });

  return res.json(jsonToken);
});

router.post("/tokenexchange", async (req, res) => {
  const jsonToken = req.body?.jsonToken;
  if (typeof jsonToken !== "string" || jsonToken.length < 10) {
    return res.status(400).json({ error: "invalid_subject_token" });
  }

  const { AUTH0_DOMAIN, AUTH0_API_CLIENT_ID, AUTH0_API_CLIENT_SECRET } =
    process.env;
  if (!AUTH0_DOMAIN || !AUTH0_API_CLIENT_ID || !AUTH0_API_CLIENT_SECRET) {
    return res.status(500).json({
      error: "missing_server_configuration",
      missing: {
        AUTH0_DOMAIN: !AUTH0_DOMAIN,
        AUTH0_API_CLIENT_ID: !AUTH0_API_CLIENT_ID,
        AUTH0_API_CLIENT_SECRET: !AUTH0_API_CLIENT_SECRET,
      },
    });
  }

  try {
    const url = `https://${AUTH0_DOMAIN}/oauth/token`;
    const body = {
      grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
      subject_token_type: "http://acme.com/legacy-token",
      subject_token: jsonToken,
      client_id: AUTH0_API_CLIENT_ID,
      client_secret: AUTH0_API_CLIENT_SECRET,
      // NOTE: Keeping Management API audience for "fresh tenant" ergonomics.
      audience: `http://acme.com/legacy-token`,
      scope: "openid",
    };

    const { data } = await axios.post(url, body, {
      headers: { "Content-Type": "application/json" },
      timeout: 10_000,
    });

    return res.status(200).json({ ...data });
  } catch (error) {
    const status = error?.response?.status ?? 500;
    const data = error?.response?.data ?? { error: "token_exchange_failed" };
    return res.status(status).json({ ...data, status });
  }
});

module.exports = router;

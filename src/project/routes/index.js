const express = require('express');
const app = require('../server');
const router = express.Router()
var jwt = require('jsonwebtoken');

router.get("/", async (req, res) => {
    res.render('pages/index');
})



module.exports = router
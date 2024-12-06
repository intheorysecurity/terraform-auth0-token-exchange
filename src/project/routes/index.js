const express = require('express');
const app = require('../server');
const router = express.Router()
var jwt = require('jsonwebtoken');

router.get("/", async (req, res) => {
    var payload = {
        audience: "http://localhost:3000",
        issuer: "api-dev",
        subject: "jamel.ahmad@intheorysecurity.com",
        givenName: "Jamel",
        lastName: "Ahmad",
        permissions: ['read:only', 'admin']
    }
    var token = jwt.sign(payload, 'password', {expiresIn: '1h'});

    jwt.verify(token, "password", function(err, decoded){
        if(err){
            console.log("wrong secret");
            return;
        }
        
        console.log("valid token");
    })
    res.render('pages/index');
})



module.exports = router
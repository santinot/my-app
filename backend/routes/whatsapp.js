const whatsapp = require('express').Router();
const { createSession } = require("../functions/whatsappFunctions");

whatsapp.get('/', (req, res) => {
    createSession('user');
    res.send('Hello from whatsapp!');
});

module.exports = whatsapp;
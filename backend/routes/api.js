// Endpoint for the API http://localhost:3000/api/...
const api = require("express").Router();
require("dotenv").config();

// Routes
api.use("/email", require("./email"));
api.use("/message", require("./message"));
api.use("/whatsapp", require("./whatsapp"));
api.use("/contact", require("./contact"));
api.use("/user", require("./user"));

module.exports = api;

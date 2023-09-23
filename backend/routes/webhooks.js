const webhooks = require('express').Router();
const { verifyEndpoint, getMessage} = require('../functions/webhooksFunctions');

// Verify webhook endpoint
webhooks.get('/', (req, res) => {
  verifyEndpoint(req, res);
});

// Handle webhook endpoint
webhooks.post('/', (req, res) => {
  const response = getMessage(req, res, "yes");
  console.log(response);
});

module.exports = webhooks;

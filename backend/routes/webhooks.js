// Endpoint for the API http://localhost:3000/webhooks/...
const webhooks = require('express').Router();
const { verifyEndpoint, getMessage} = require('../functions/webhooksFunctions');

// Verify webhook endpoint
webhooks.get('/', (req, res) => {
  verifyEndpoint(req, res);
});

// Handle webhook endpoint
webhooks.post('/', (req, res) => {
  const response = getMessage(req, res, 1);
  console.log(response);
});

module.exports = webhooks;

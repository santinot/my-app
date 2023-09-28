// Endpoint for the API http://localhost:3000/api/...
const api = require('express').Router();
require('dotenv').config()

api.get('/', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

// Routes
api.use('/mail', require('./mail'));
api.use('/message', require('./message'));
api.use('/whatsapp', require('./whatsapp'));

module.exports = api;

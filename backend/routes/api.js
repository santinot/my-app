// Endpoint for the API es. http://localhost:3000/api
const express = require('express');
var router = express.Router();

const mailRouter = require('./mail')

router.get('/', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

router.get('/test', (req, res) => {
  res.json({ message: 'Hello from test!' });
});
// Routes
router.use('/mail', mailRouter)

module.exports = router;

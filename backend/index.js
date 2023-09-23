const express = require('express');
const cors = require('cors');

const app = express();
// È necessario eseguire il seguente comando per ottenere un URL pubblico per il webhook
// ngrok http --domain=terribly-credible-boxer.ngrok-free.app 3001

app.use(cors());
app.use(express.json());
// http://localhost:3001/
app.get('/', function (req, res) {
  res.send('Hello World');
});
// http://localhost:3001/api
app.use('/api', require('./routes/api'));
// http://localhost:3001/webhooks
app.use('/webhooks', require('./routes/webhooks'));

app.listen(3001, () => console.log('Server running on port 3001'));


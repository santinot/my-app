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

// message.use(bodyParser.json());

// message.get("/", (req, res) => {
//   res.send("Hello from message");
// });

// message.post("/send", (req, res) => {
//   const data = getTextMessageInput(
//     process.env.RECIPIENT_WAID,
//     "Messaggio inviato tramite API POST da http://localhost:3001/api/message/send"
//   );
//   sendMessage(data)
//     .then((response) => {
//       //res.redirect("/");
//       res.send(JSON.stringify(response.data));
//       //res.sendStatus(200);
//       return;
//     })
//     .catch((error) => {
//       console.log(error);
//       res.sendStatus(500);
//       return;
//     });
// });
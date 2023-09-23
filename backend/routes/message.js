const message = require("express").Router();
const bodyParser = require("body-parser");
const {
  sendMessage,
  getTextMessageInput,
} = require("../functions/messageFunctions");

message.use(bodyParser.json());

message.get("/", (req, res) => {
  res.send("Hello from message");
});

message.post("/send", (req, res) => {
  const data = getTextMessageInput(
    process.env.RECIPIENT_WAID,
    "Messaggio inviato tramite API POST da http://localhost:3001/api/message/send"
  );
  sendMessage(data)
    .then((response) => {
      //res.redirect("/");
      res.send(JSON.stringify(response.data));
      //res.sendStatus(200);
      return;
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
      return;
    });
});

module.exports = message;

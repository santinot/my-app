const webhook = require("express").Router();
require("dotenv").config();
const axios = require("axios");

webhook.get("/", (req, res) => {
  const verify_token = process.env.VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === verify_token) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

webhook.post("/", (req, res) => {
  if (req.body.object) {
    if (
      req.body.entry &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
    ) {
      const phone_number =
        req.body.entry[0].changes[0].value.metadata.phone_number_id;
      const from = req.body.entry[0].changes[0].value.messages[0].from;
      const msg_body = req.body.entry[0].changes[0].value.messages[0].text.body;
      axios({
        method: "POST",
        url: `https://graph.facebook.com/${process.env.VERSION}/${phone_number}/messages?access_token=${process.env.ACCESS_TOKEN}`,
        data: {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: from,
          type: "text",
          text: { body: `You said: ${msg_body}` },
        },
      });
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

module.exports = webhook;

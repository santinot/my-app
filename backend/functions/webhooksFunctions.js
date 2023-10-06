require("dotenv").config();
const axios = require("axios");
const fs = require("fs");

function verifyEndpoint(req, res) {
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
}

function getMessage(req, res, isPost) {
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
      // For sending a message back
      if (isPost) {
        axios({
          method: "POST",
          url: `https://graph.facebook.com/${process.env.VERSION}/${phone_number}/messages?access_token=${process.env.ACCESS_TOKEN}`,
          data: {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: from,
            type: "text",
            text: {
              body: `È stato ricevuto il seguente messaggio: ${msg_body}`,
            },
          },
        });
      }
    }
    res.sendStatus(200);
    return req.body.entry[0].changes[0];
  } else {
    res.sendStatus(404);
  }
}


function getImage(req, res) {
  if (req.body.object) {
    if (
      req.body.entry &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
    ) {
      const img_id = req.body.entry[0].changes[0].value.messages[0].image.id;
      axios({
        method: "GET",
        url: `https://graph.facebook.com/${process.env.VERSION}/${img_id}?access_token=${process.env.ACCESS_TOKEN}`,
      }).then((response) => {
        const url = response.data["url"];
        downloadImage(url);
      });
      res.sendStatus(200);
      //return img_id;
    }
  } else {
    res.sendStatus(404);
  }
}

function downloadImage(url) {
  axios({
    method: "GET",
    url: `${url}?access_token=${process.env.ACCESS_TOKEN}`,
  }).then((response) => {
    //console.log(response);
  });
}

module.exports = {
  verifyEndpoint,
  getMessage
};

// function sendMessage(data) {
//   var config = {
//     method: 'post',
//     url: `https://graph.facebook.com/${process.env.VERSION}/${process.env.PHONE_NUMBER_ID}/messages`,
//     headers: {
//       'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
//       'Content-Type': 'application/json'
//     },
//     data: data
//   };
//   console.log(config)
//   return axios(config)
// }

// function getTextMessageInput(recipient, text) {
//   return JSON.stringify({
//     "messaging_product": "whatsapp",
//     "preview_url": false,
//     "recipient_type": "individual",
//     "to": recipient,
//     "type": "text",
//     "text": {
//         "body": text
//     }
//   });
// }
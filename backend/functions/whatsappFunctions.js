const qrcode = require("qrcode-terminal");
const { Client, RemoteAuth } = require("whatsapp-web.js");
const { MongoStore } = require("wwebjs-mongo");
const mongoose = require("mongoose");
let store;

mongoose.connect("mongodb://localhost:27017/whatsapp").then(()=> {
  store = new MongoStore({ mongoose: mongoose });
});

function createSession(id) {
  const client = new Client({
    authStrategy: new RemoteAuth({
      store : store,
      backupSyncIntervalMs: 500000,
      clientId: id
    }),
  })

  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
  })

  client.on("ready", () => {
    console.log("Client is ready!");
  })

  client.on("remote_session_saved", () => {
    console.log("Client session saved!");
  })
  
  client.initialize();
}

module.exports = {
  createSession
};

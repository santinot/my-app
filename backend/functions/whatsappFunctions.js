let qrcode = require("qrcode-terminal");
let { Client, RemoteAuth } = require("whatsapp-web.js");
let { MongoStore } = require("wwebjs-mongo");
let mongoose = require("mongoose");
let client, store;

mongoose.connect("mongodb://localhost:27017/whatsapp").then(() => {
  store = new MongoStore({ mongoose: mongoose });
});

async function createSession() {
  client = new Client({
    authStrategy: new RemoteAuth({
      store: store,
      backupSyncIntervalMs: 60000,
      clientId: "User",
    }),
  });

  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
  });

  client.on("ready", () => {
    console.log("Client is ready!");
  });

  client.on("auth_failure", (session) => {
    console.log("Auth failure", session);
  });

  client.on("remote_session_saved", () => {
    console.log("Client session saved!");
  });

  client.on("disconnected", (reason) => {
    console.log("Client was logged out", reason);
  });

  client.initialize();

  return "Connection...";
}

async function getChats(){
  if(!client) return ("Client not created!");
  const response = client.getChats().then((chat) => { // Return an array of Chat objects
      const chats = [];
      for (let i = 0; i < chat.length; i++) {
          const dateFormat = new Date(chat[i].timestamp * 1000);
          chats.push([chat[i].id.user, "whatsapp", chat[i].name,chat[i].lastMessage.body ,dateFormat.toLocaleString('it-IT'), ]); //chat[i].lastMessage.body
      }
      return chats;
    });
  return response;
}

function logoutSession(){
  // const db = mongoose.connection.db;
  // db.collection("whatsapp-RemoteAuth-User.chunks").drop();
  // db.collection("whatsapp-RemoteAuth-User.files").drop();
  const response = client.logout().then(() => {
    return("Client logged out!");
  });
  return response;
}

module.exports = {
  createSession,
  getChats,
  logoutSession,
};

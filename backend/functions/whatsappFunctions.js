let os = require("os");
const path = require("path");
let downloadPath = path.join(os.homedir(), "Downloads");
let qrcode = require("qrcode-terminal");
let { Client, RemoteAuth, Message } = require("whatsapp-web.js");
let { MongoStore } = require("wwebjs-mongo");
let mongoose = require("mongoose");
let client, store;


mongoose.connect("mongodb://localhost:27017/whatsapp").then(() => {
  store = new MongoStore({ mongoose: mongoose });
});

async function createSession(socket) {
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
    socket.emit("test", "socket.io");
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

async function getChats() {
  if (!client) return "Client not created!";
  const response = client.getChats().then((chat) => {
    // Return an array of Chat objects
    const array = [];
    for (let i = 0; i < chat.length; i++) {
      const dateFormat = new Date(chat[i].timestamp * 1000);
      array.push({
        id: chat[i].id.user,
        type: "whatsapp",
        from: chat[i].name,
        subject: chat[i].lastMessage.type,
        snippet: chat[i].lastMessage.fromMe
          ? "Tu: " + chat[i].lastMessage.body
          : chat[i].lastMessage.body,
        date: dateFormat.toLocaleString("it-IT"),
      });
    }
    return array;
  });
  return response;
}

async function logoutSession() {
  const response = client.logout().then(() => {
    const db = mongoose.connection.db;
    db.collection("whatsapp-RemoteAuth-User.chunks").drop();
    db.collection("whatsapp-RemoteAuth-User.files").drop();
    return "Client logged out!";
  });
  return response;
}

async function getAttachment(message) {
  const response = message.downloadMedia().then((media) => {
    return response.push(media.data, media.mimetype, media.filename);
  });
  // Save the attachment to a file
  const filename = response[2] || "untitled-attachment";
  fs2.writeFileSync(
    `${downloadPath}/${filename}`,
    Buffer.from(response[0], "base64")
  );
  console.log(`Downloaded ${filename}`);
  return response.data;
}

async function sendTextMessage(chatId, content) {
  const response = client.sendMessage(chatId, content).then((message) => {
    console.log(message);
  });
  return response
}

module.exports = {
  createSession,
  getChats,
  logoutSession,
  getAttachment,
  sendTextMessage,
};

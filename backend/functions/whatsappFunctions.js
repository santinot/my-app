let os = require("os");
const path = require("path");
let downloadPath = path.join(os.homedir(), "Downloads");
let qrcode = require("qrcode-terminal");
let { Client, RemoteAuth } = require("whatsapp-web.js");
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
    socket.emit("qrCode", qr);
    qrcode.generate(qr, { small: true });
  });

  client.on("ready", () => {
    console.log("Client is ready!");
    socket.emit("clientReady", 200);
  });

  client.on("message", (message) => {
    socket.emit("newMessage", message);
  });

  client.on("message_create", (message) => {
    socket.emit("newMessage", message);
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
        chatId: chat[i].id._serialized,
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

async function getAttachment(name, data) {
  // Save the attachment to a file
  const filename = name || "untitled-attachment";
  fs2.writeFileSync(
    `${downloadPath}/${filename}`,
    Buffer.from(data, "base64")
  );
  console.log(`Downloaded ${filename}`);
  return 0;
}

async function sendTextMessage(chatId, content) {
  const response = client.sendMessage(chatId, content).then((message) => {
    return message;
  });
  return response;
}

async function singleChat(chatId, limit) {
  const chat = await client.getChatById(chatId);
  const messages = await chat.fetchMessages({ limit: limit });

  const messageArray = [];

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    const attachment = [];

    if (message.hasMedia) {
      const media = await message.downloadMedia();
      attachment.push({
        mimetype: media.mimetype,
        data: media.data,
        name: media.filename,
      });
    }

    const dateFormat = new Date(message.timestamp * 1000);

    messageArray.push({
      id: message.id.id,
      chatId: message.id.remote,
      type: "whatsapp",
      attachment: attachment.length !== 0 ? attachment : null,
      fromMe: message.fromMe,
      subject: message.type,
      snippet: message.body,
      date: dateFormat.toLocaleString("it-IT"),
    });
  }

  return messageArray;
}

module.exports = {
  createSession,
  getChats,
  logoutSession,
  getAttachment,
  sendTextMessage,
  singleChat,
};

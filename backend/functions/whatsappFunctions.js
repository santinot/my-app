const os = require("os");
const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");
const qrcode = require("qrcode-terminal");
let { Client, RemoteAuth } = require("whatsapp-web.js");
let { MongoStore } = require("wwebjs-mongo");
let mongoose = require("mongoose");

const sessionPath = path.join(__dirname, "../.wwebjs_auth");
const cachePath = path.join(__dirname, "../.wwebjs_cache");
const downloadPath = path.join(os.homedir(), "Downloads");
let client, store;

// Connect to MongoDB for remote authentication session storage
mongoose.connect("mongodb://localhost:27017/whatsapp").then(() => {
  store = new MongoStore({ mongoose: mongoose });
});

// Create session with all functions for WhatsApp
async function createSession(socket) {
  if (client) return socket.emit("clientReady", 200);
  client = new Client({
    authStrategy: new RemoteAuth({
      store: store,
      backupSyncIntervalMs: 60000,
      clientId: "User",
    }),
  });

  // Generate QR code
  client.on("qr", (qr) => {
    socket.emit("qrCode", qr);
    //qrcode.generate(qr, { small: true });
  });

  // Communicate when the client is ready
  client.on("ready", () => {
    console.log("Client is ready!");
    socket.emit("clientReady", 200);
  });

  // Communicate when messages are received
  client.on("message", (message) => {
    socket.emit("newMessage", message);
  });

  // Communicate when messages are sent
  client.on("message_create", (message) => {
    socket.emit("newMessage", message);
  });

  // Communicate authentication failure
  client.on("auth_failure", (session) => {
    console.log("Auth failure", session);
  });

  // Communicate when the session is saved on first login
  client.on("remote_session_saved", () => {
    console.log("Client session saved!");
  });

  // Communicate when the client is logged out
  client.on("disconnected", (reason) => {
    console.log("Client was logged out", reason);
  });

  client.initialize();
  return "Connection...";
}

// Get all chats
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

// Logout from WhatsApp deleting session files from MongoDB and local storage cache
async function logoutSession() {
  const response = await client
    .logout()
    .then(async () => {
      const db = mongoose.connection.db;
      if (
        await db
          .listCollections({ name: "whatsapp-RemoteAuth-User.chunks" })
          .hasNext()
      ) {
        await db.collection("whatsapp-RemoteAuth-User.chunks").drop();
      }
      if (
        await db
          .listCollections({ name: "whatsapp-RemoteAuth-User.files" })
          .hasNext()
      ) {
        await db.collection("whatsapp-RemoteAuth-User.files").drop();
      }

      try {
        if (fs.existsSync(sessionPath)) {
          rimraf.sync(sessionPath);
        }

        if (fs.existsSync(cachePath)) {
          rimraf.sync(cachePath);
        }

        return 200;
      } catch (error) {
        console.error("Errore durante la rimozione di file o cartelle:", error);
        return 500;
      }
    })
    .catch((error) => {
      console.error("Errore durante il logout:", error);
      return 500;
    });

  return response;
}

// Download attachment from WhatsApp ???
async function getAttachment(name, data) {
  const filename = name || "untitled-attachment";
  fs2.writeFileSync(`${downloadPath}/${filename}`, Buffer.from(data, "base64"));
  console.log(`Downloaded ${filename}`);
  return 0;
}

// Send text message to a chat
async function sendTextMessage(chatId, content) {
  const response = client.sendMessage(chatId, content).then((message) => {
    return message;
  });
  return response;
}

// Get all(limit) messages from a single chat
async function singleChat(chatId, limit) {
  const chat = await client.getChatById(chatId);
  const messages = await chat.fetchMessages({ limit: limit });
  const messageArray = [];

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    const attachment = [];

    // Check if message has media
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

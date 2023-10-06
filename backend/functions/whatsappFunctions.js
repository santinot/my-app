const qrcode = require("qrcode-terminal");
const { Client, RemoteAuth } = require("whatsapp-web.js");

function createSession(client, store, res) {
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
    client.getChats().then((chat) => { // Return an array of Chat objects
      const chats = [];
      for (let i = 0; i < chat.length; i++) {
          const dateFormat = new Date(chat[i].timestamp * 1000);
          chats.push([chat[i].id.user, chat[i].name, dateFormat.toLocaleString('it-IT'), ]); //chat[i].lastMessage.body
      }
      res.send(chats);
    });
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
}

function deleteSession(client, mongoose){
  client.logout();
  const db = mongoose.connection.db;
  db.collection("whatsapp-RemoteAuth-User.chunks").drop();
  db.collection("whatsapp-RemoteAuth-User.files").drop();
  mongoose.connection.close();
}

module.exports = {
  createSession,
  deleteSession
};

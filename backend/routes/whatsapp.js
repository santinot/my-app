const whatsapp = require("express").Router();
const {
  createSession,
  getChats,
  logoutSession,
  downloadMedia,
  sendTextMessage,
  singleChat,
} = require("../functions/whatsappFunctions");

// Login 
whatsapp.get("/login", async (req, res) => {
  try {
    const response = await createSession(req.io);
    res.send(response);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }
});

// Get all chats
whatsapp.get("/chats", async (req, res) => {
  try {
    const response = await getChats();
    res.send(response);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }
});

// Logout
whatsapp.get("/logout", async (req, res) => {
  try {
    const response = await logoutSession();
    res.sendStatus(response);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }
});

// Download attachment
whatsapp.post("/downloadMedia", async (req, res) => {
  try {
    const response = await downloadMedia(req.body.attachment);
    res.sendStatus(response);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }
});

// Send message
whatsapp.post("/send", async (req, res) => {
  try {
    const response = await sendTextMessage(req.body.chatId, req.body.content);
    res.send(response);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }
});

// Get single chat
whatsapp.get("/singleChat/:chatId/:limit", async (req, res) => {
  try {
    const response = await singleChat(req.params.chatId, req.params.limit);
    res.send(response);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }
});

module.exports = whatsapp;

const whatsapp = require("express").Router();
const {
  createSession,
  getChats,
  logoutSession,
  getAttachment,
  sendTextMessage,
  singleChat,
} = require("../functions/whatsappFunctions");

whatsapp.get("/login", async (req, res) => {
  try {
    const response = await createSession(req.io);
    res.send(response);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }
});

whatsapp.get("/chats", async (req, res) => {
  try {
    const response = await getChats();
    res.send(response);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }
});

whatsapp.get("/logout", async (req, res) => {
  try {
    const response = await logoutSession();
    res.sendStatus(response);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }
});

whatsapp.post("/download", async (req, res) => {
  try {
    const response = await getAttachment(req.body.name, req.body.data);
    res.send(response);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }
});

whatsapp.post("/send", async (req, res) => {
  try{
    const response = await sendTextMessage(req.body.chatId, req.body.content);
    res.send(response);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }
});

whatsapp.get("/singleChat/:chatId/:limit", async (req, res) => {
  try{
    const response = await singleChat(req.params.chatId, req.params.limit);
    res.send(response);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }
});

module.exports = whatsapp;

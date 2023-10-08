const whatsapp = require("express").Router();
const {createSession, getChats, logoutSession} = require("../functions/whatsappFunctions");

whatsapp.get("/login", async (req, res) => {
  try {
    const response = await createSession();
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
    res.send(response);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }
});

module.exports = whatsapp;

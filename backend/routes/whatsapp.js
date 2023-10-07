const whatsapp = require("express").Router();
const { MongoStore } = require("wwebjs-mongo");
const mongoose = require("mongoose");
let store, client;
const {
  createSession,
  deleteSession,
} = require("../functions/whatsappFunctions");

mongoose.connect("mongodb://localhost:27017/whatsapp").then(() => {
  store = new MongoStore({ mongoose: mongoose });
});

whatsapp.get("/", (req, res) => {
  try {
    createSession(client, store, res);
    //res.send("Connection...");
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }
});

whatsapp.get("/logout", (req, res) => {
  try {
    deleteSession(mongoose);
    res.send("Client logged out!");
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }
});

module.exports = whatsapp;

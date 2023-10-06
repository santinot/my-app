const message = require("express").Router();
const { getMessages } = require("../functions/messageFunctions");

message.get("/getMessages", async (req, res) => {
  try {
    const messagesData = await getMessages();
    res.json(messagesData);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = message;

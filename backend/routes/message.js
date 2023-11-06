const message = require("express").Router();
const { getMessages } = require("../functions/messageFunctions");

// Get all messages (whatsapp and gmail)
message.get("/getMessages/:user", async (req, res) => {
  try {
    const messagesData = await getMessages(req.params.user);
    res.json(messagesData);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = message;

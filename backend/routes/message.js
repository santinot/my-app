const message = require("express").Router();
const { getMessages, sentimentAnalysis } = require("../functions/messageFunctions");

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

message.post("/analysis", async (req, res) => {
  try {
    const response = await sentimentAnalysis(
      req.body.id,
      req.body.message,
      req.body.score
    );
    res.json(response);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = message;

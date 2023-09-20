const mail = require("express").Router();
const { getProfile, getMessages, sendMessage } = require("../functions/mailFunctions");

mail.get("/:userId", async (req, res) => {
  try {
    const profileData = await getProfile(req.params.userId);
    res.json(profileData);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" }); 
  }
});

mail.get("/:userId/messages", async (req, res) => {
  try {
    const messagesData = await getMessages(req.params.userId);
    res.json(messagesData);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" }); 
  }
});

mail.post("/:userId/send", async (req, res) => {
  try {
    const to = req.body["To"]
    const subject = req.body["Subject"]
    const message = req.body["Message"]
    const messagesData = await sendMessage(req.params.userId, to, subject, message);
    res.json(messagesData);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = mail;


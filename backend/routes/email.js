const mail = require("express").Router();
const { getProfile, getEmails, sendEmails } = require("../functions/emailFunctions");

mail.get("/:userId/getProfile", async (req, res) => {
  try {
    const profileData = await getProfile(req.params.userId);
    res.json(profileData);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" }); 
  }
});

mail.get("/:userId/getEmails", async (req, res) => {
  try {
    const messagesData = await getEmails(req.params.userId);
    res.json(messagesData);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" }); 
  }
});

mail.post("/:userId/sendEmails", async (req, res) => {
  try {
    const to = req.body["To"]
    const subject = req.body["Subject"]
    const message = req.body["Message"]
    const messagesData = await sendEmails(req.params.userId, to, subject, message);
    res.json(messagesData);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = mail;


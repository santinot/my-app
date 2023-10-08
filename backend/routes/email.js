const mail = require("express").Router();
const { getProfile, getEmails, sendEmails, trashEmails, untrashEmails, getAttachments } = require("../functions/emailFunctions");

mail.get("/:userId/getProfile", async (req, res) => {
  try {
    const profileData = await getProfile(req.params.userId);
    res.json(profileData);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" }); 
  }
});

mail.get("/:userId/getEmails/:labelIds/", async (req, res) => {
  try {
    const messagesData = await getEmails(req.params.userId, req.params.labelIds);
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

mail.post("/:userId/trashEmails", async (req, res) => {
  try {
    const messageId = req.body["id"]
    const messagesData = await trashEmails(req.params.userId, messageId);
    res.json(messagesData);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

mail.post("/:userId/untrashEmails", async (req, res) => {
  try {
    const messageId = req.body["id"]
    const messagesData = await untrashEmails(req.params.userId, messageId);
    res.json(messagesData);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

mail.get("/:userId/getAttachments/:messageId/:attachmentId/:filename", async (req, res) => {
  try {
    const messagesData = await getAttachments(req.params.userId, req.params.messageId, req.params.attachmentId, req.params.filename);
    res.json(messagesData);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" }); 
  }
});

module.exports = mail;


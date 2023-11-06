const email = require("express").Router();
const {
  getProfile,
  getEmails,
  sendEmail,
  getAttachment,
  singleEmail,
  pageTokenList,
  logoutProfile,
} = require("../functions/emailFunctions");

// Get user profile data
email.get("/:userId/getProfile", async (req, res) => {
  try {
    const profileData = await getProfile(req.params.userId);
    res.json(profileData);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all user emails of a specific label and page
email.get("/:userId/getEmails/:labelIds/:pageToken?", async (req, res) => {
  try {
    const messagesData = await getEmails(
      req.params.userId,
      req.params.labelIds,
      req.params.pageToken
    );
    res.json(messagesData);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Send email
email.post("/:userId/sendEmail", async (req, res) => {
  try {
    const to = req.body["To"];
    const subject = req.body["Subject"];
    const message = req.body["Message"];
    const messagesData = await sendEmail(
      req.params.userId,
      to,
      subject,
      message
    );
    res.json(messagesData);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// email.post("/:userId/trashEmail", async (req, res) => {
//   try {
//     const messageId = req.body["id"];
//     const messagesData = await trashEmail(req.params.userId, messageId);
//     res.json(messagesData);
//   } catch (error) {
//     console.error("An error occurred:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// email.post("/:userId/untrashEmail", async (req, res) => {
//   try {
//     const messageId = req.body["id"];
//     const messagesData = await untrashEmail(req.params.userId, messageId);
//     res.json(messagesData);
//   } catch (error) {
//     console.error("An error occurred:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// Download document attachment
email.get(
  "/:userId/getAttachment/:messageId/:attachmentId/:filename",
  async (req, res) => {
    try {
      const messagesData = await getAttachment(
        req.params.userId,
        req.params.messageId,
        req.params.attachmentId,
        req.params.filename
      );
      res.json(messagesData);
    } catch (error) {
      console.error("An error occurred:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Get single email message
email.get("/:userId/singleEmail/:messageId", async (req, res) => {
  try {
    const messagesData = await singleEmail(
      req.params.userId,
      req.params.messageId
    );
    res.json(messagesData);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get page token list
email.get("/:userId/pageTokenList/:labelIds/", async (req, res) => {
  try {
    const messagesData = await pageTokenList(
      req.params.userId,
      req.params.labelIds
    );
    res.json(messagesData);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Logout profile
email.get("/:userId/logoutProfile", async (req, res) => {
  try {
    const response = logoutProfile(req.params.userId);
    res.sendStatus(response);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = email;

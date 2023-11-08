const contact = require("express").Router();
const {
  addContact,
  deleteContact,
  updateContact,
  getContacts,
  getContactByLabel,
} = require("../functions/contactFunctions");

// Add contact
contact.post("/addContact", async (req, res) => {
  try {
    const user = req.body["user"];
    const label = req.body["label"];
    const email = req.body["email"];
    const whatsapp = req.body["whatsapp"];
    const contactData = await addContact(user, label, email, whatsapp);
    res.json(contactData);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all contacts
contact.get("/getContacts/:user", async (req, res) => {
  try {
    const contactData = await getContacts(req.params.user);
    res.json(contactData);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete contact
contact.delete("/deleteContact/:user/:id", async (req, res) => {
  try {
    const contactData = await deleteContact(req.params.user, req.params.id);
    res.json(contactData);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update contact
contact.put("/updateContact", async (req, res) => {
  try {
    const user = req.body["user"];
    const contactid = req.body["id"];
    const email = req.body["email"];
    const whatsapp = req.body["whatsapp"];
    const contactData = await updateContact(user, contactid, email, whatsapp);
    res.json(contactData);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get specific contact information
contact.get("/getContactByLabel/:user/:label", async (req, res) => {
  try {
    const contactData = await getContactByLabel(
      req.params.user,
      req.params.label
    );
    res.json(contactData);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = contact;

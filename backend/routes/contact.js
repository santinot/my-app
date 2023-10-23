const contact = require('express').Router();
const {
    contactsCollection,
    addContact,
    deleteContact,
    updateContact,
    getContacts,
    checkContact
    } = require('../functions/contactFunctions');

contact.post("/addContact", async (req, res) => {
    try {
        const label = req.body["label"]
        const email = req.body["email"]
        const whatsapp = req.body["whatsapp"]
        const contactData = await addContact(label, email, whatsapp);
        res.json(contactData); // assegnare l'id al box contatto
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

contact.get("/contactsCollection", async (req, res) => {
    try {
        const contactData = await contactsCollection();
        res.json(contactData);
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

contact.get("/getContacts", async (req, res) => {
    try {
        const contactData = await getContacts();
        res.json(contactData);
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

contact.delete("/deleteContact/:id", async (req, res) => {
    try {
        const contactid = req.params.id;
        const contactData = await deleteContact(contactid);
        res.json(contactData);
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


module.exports = contact;
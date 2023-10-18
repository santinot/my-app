const contact = require('express').Router();
const {
    contactsCollection,
    createContact,
    deleteContact,
    updateContact,
    getContacts,
    checkContact
    } = require('../functions/contactFunctions');

contact.post("/createContact", async (req, res) => {
    try {
        const label = req.body["label"]
        const email = req.body["email"]
        const whatsapp = req.body["whatsapp"]
        const contactData = await createContact(label, email, whatsapp);
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


module.exports = contact;
const { MongoClient, ObjectId } = require("mongodb");
const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri);

// Add contact to the database
async function addContact(user, label, email, whatsapp) {
  try {
    await client.connect();
    const database = client.db("App");
    const contact = { label: label, email: email, whatsapp: whatsapp };
    const result = await database
      .collection("contacts/" + user)
      .insertOne(contact);
    return result;
  } catch (error) {
    console.error(error);
  }
}

// Delete contact from the database
async function deleteContact(user, contactid) {
  try {
    await client.connect();
    const database = client.db("App");
    const result = await database
      .collection("contacts/" + user)
      .deleteOne({ _id: new ObjectId(contactid) });
    return result;
  } catch (error) {
    console.error(error);
  }
}

// Update contact in the database
async function updateContact(user, contactid, email, whatsapp) {
  try {
    await client.connect();
    const database = client.db("App");
    const result = await database
      .collection("contacts/" + user)
      .updateOne(
        { _id: new ObjectId(contactid) },
        { $set: { email: email, whatsapp: whatsapp } }
      );
    return result;
  } catch (error) {
    console.error(error);
  }
}

// Get all contacts of the user
async function getContacts(user) {
  try {
    await client.connect();
    const database = client.db("App");
    const result = await database
      .collection("contacts/" + user)
      .find()
      .toArray();
    return result;
  } catch (error) {
    console.error(error);
  }
}

// Check if the sender is a contact
async function checkContact(user, type, value) {
  try {
    await client.connect();
    const database = client.db("App");
    const result = await (type === "gmail"
      ? database
          .collection("contacts/" + user)
          .findOne({ email: value.match(/<(.*?)>/)?.[1] })
      : database
          .collection("contacts/" + user)
          .findOne({ whatsapp: value.slice(2) }));
    return result;
    // example response -> {"_id": "652d2a6075c37d7391ce49bc", "label": "Santino", "email": "santi2001@hotmail.it", "whatsapp": "3290077255"}
  } catch (error) {
    console.error(error);
  }
}

// Get contact by label
async function getContactByLabel(user, label) {
  try {
    await client.connect();
    const database = client.db("App");
    const result = await database
      .collection("contacts/" + user)
      .findOne({ label: label });
    return result;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  addContact,
  deleteContact,
  updateContact,
  getContacts,
  checkContact,
  getContactByLabel,
};

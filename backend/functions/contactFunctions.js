const { MongoClient, ObjectId } = require("mongodb");
const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri);

async function addContact(user, label, email, whatsapp) {
  try {
    await client.connect();
    const database = client.db("App");
    const contact = { label: label, email: email, whatsapp: whatsapp };
    const result = await database
      .collection("contacts/" + user)
      .insertOne(contact);
    console.log(
      `Contact with email ${email} and whatsapp ${whatsapp} created successfully.`
    );
    return result;
  } catch (error) {
    console.error(error);
  }
}

async function deleteContact(user, contactid) {
  try {
    await client.connect();
    const database = client.db("App");
    const result = await database
      .collection("contacts/" + user)
      .deleteOne({ _id: new ObjectId(contactid) });
    console.log(`Contact deleted successfully.`);
    return result;
  } catch (error) {
    console.error(error);
  }
}

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
    console.log(`Contact updated successfully.`);
    return result;
  } catch (error) {
    console.error(error);
  }
}

async function getContacts(user) {
  try {
    await client.connect();
    const database = client.db("App");
    const result = await database
      .collection("contacts/" + user)
      .find()
      .toArray();
    console.log(`Contacts retrieved successfully.`);
    return result;
  } catch (error) {
    console.error(error);
  }
}

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
  } catch (error) {
    console.error(error);
  }
}
//ritorna null se non trovato, altrimenti ritorna il contatto -> {"_id": "652d2a6075c37d7391ce49bc", "label": "Santino", "email": "santi2001@hotmail.it", "whatsapp": "3290077255"}
module.exports = {
  addContact,
  deleteContact,
  updateContact,
  getContacts,
  checkContact,
};

//{_id: ObjectId('65294c66f6b73674888cc5f8')}

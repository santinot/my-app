const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27017/';
const client = new MongoClient(uri);

async function contactsCollection() {
    try {
        await client.connect();
        const database = client.db('App');
        const collections = await database.listCollections().toArray();
        const collectionExists = collections.some(collection => collection.name === 'contacts');
        if (!collectionExists) {
            await database.createCollection('contacts');
            return "Contacts collection created successfully."
        } else {
            return "Contacts collection already exists.";
        }
    } catch (error) {
        return(error);
    } finally {
        await client.close();
    }
}

async function createContact(label, email, whatsapp){
    try {
        await client.connect();
        const database = client.db('App');
        const contact = { label:label, email: email, whatsapp: whatsapp };
        const result = await database.collection('contacts').insertOne(contact);
        console.log(`Contact with email ${email} and whatsapp ${whatsapp} created successfully.`);
        return result;
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}


async function deleteContact(contactid){
    try {
        await client.connect();
        const database = client.db('App');
        const result = await database.collection('contacts').deleteOne({ id:contactid });
        console.log(`Contact deleted successfully.`);
        return result;
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

async function updateContact(contactid, email, whatsapp){
    try{
        await client.connect();
        const database = client.db('App');
        const result = await database.collection('contacts').updateOne({ id:contactid }, { $set: { email: email, whatsapp: whatsapp } });
        console.log(`Contact updated successfully.`);
        return result;
    } catch (error) {
        console.error(error);
    }
    finally{
        await client.close();
    }
}

async function getContacts(){ 
    try{
        await client.connect();
        const database = client.db('App');
        const result = await database.collection('contacts').find().toArray();
        console.log(`Contacts retrieved successfully.`);
        return result;
    } catch (error) {
        console.error(error);
    }
    finally{
        await client.close();
    }
}

async function checkContact(type, value){ //{_id: ObjectId('65294c66f6b73674888cc5f8')}
    try{
        await client.connect();
        const database = client.db('App');
        const result = await (type === "gmail" ? database.collection('contacts').findOne({ email: value }) : database.collection('contacts').findOne({ whatsapp: value}));    
        return result;
    } catch (error) {
        console.error(error);
    }
    finally{
        await client.close();
    }
}

module.exports = {
    contactsCollection,
    createContact,
    deleteContact,
    updateContact,
    getContacts,
    checkContact,
};
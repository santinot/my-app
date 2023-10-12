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
            console.log('Contacts collection created successfully.');
        } else {
            console.log('Contacts collection already exists.');
        }
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

async function createContact(contactId, email, phone){
    try {
        await client.connect();
        const database = client.db('App');
        const contact = { id:contactId, email: email, phone: phone };
        const result = await database.collection('contacts').insertOne(contact);
        console.log(`Contact with email ${email} and phone ${phone} created successfully.`);
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

async function updateContact(contactid, email, phone){
    try{
        await client.connect();
        const database = client.db('App');
        const result = await database.collection('contacts').updateOne({ id:contactid }, { $set: { email: email, phone: phone } });
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

async function findContact(){
    //TODO
}

module.exports = {
    contactsCollection,
    createContact,
    deleteContact,
    updateContact,
};
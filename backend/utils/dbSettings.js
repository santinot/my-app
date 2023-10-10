const { MongoClient } = require('mongodb');

async function contactsCollection() {
    const uri = 'mongodb://localhost:27017/';
    const client = new MongoClient(uri);
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

contactsCollection();

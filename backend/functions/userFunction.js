const { MongoClient, ObjectId } = require("mongodb");
const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri);
const bcrypt = require("bcryptjs");

async function signUp(username, password) {
  try {
    await client.connect();
    const database = client.db("App");
    const collections = await database.collection("users").find().toArray();
    const userExists = collections.some(
      (collection) => collection.username === username
    );
    if (userExists) {
      return {
        acknowledged: false,
        insertedId: null,
        message: "User already exists.",
      };
    } else {
      const user = { username: username, password: password };
      const result = await database.collection("users").insertOne(user);
      console.log(`User with username ${username} created successfully.`);
      return result;
    }
  } catch (error) {
    return error;
  }
}

async function signIn(username, password) {
  try {
    await client.connect();
    const database = client.db("App");
    const collections = await database.collection("users").find().toArray();
    const userExists = collections.some(
      (collection) => collection.username === username
    );
    if (userExists) {
      const user = collections.find(
        (collection) => collection.username === username
      );
      const isMatch = await bcrypt
        .compare(password, user.password)
        .then((isMatch) => {
          return isMatch;
        });
      if (isMatch) {
        return { acknowledged: true, userId: user._id };
      } else {
        return { acknowledged: false, userId: null };
      }
    } else {
      return { acknowledged: false, userId: null };
    }
  } catch (error) {
    return error;
  }
}

async function deleteUser(userId) {
  try {
    await client.connect();
    const database = client.db("App");
    const resultUser = await database
      .collection("users")
      .deleteOne({ _id: new ObjectId(userId) });
    const resultContacts = await database
      .collection("contacts/" + userId)
      .drop();
    return { resultUser, resultContacts };
  } catch (error) {
    console.error(error);
  }
}

async function getUser(userId) {
  try {
    await client.connect();
    const database = client.db("App");
    const result = await database
      .collection("users")
      .find({ _id: new ObjectId(userId) })
      .toArray();
    return result;
  } catch (error) {
    console.error(error);
  }
}

async function modifyUser(userId, username, password) {
  try {
    await client.connect();
    const database = client.db("App");
    const result = await database.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          username: username,
          password: password,
        },
      }
    );
    return result;
  } catch (error) {
    console.error(error);
  }
}

async function logoutUser() {
  try {
    const gmailResponse = await fetch(
      "http://localhost:3001/api/email/me/logoutProfile",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const whatsappResponse = await fetch(
      "http://localhost:3001/api/whatsapp/logout",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (gmailResponse.status === 200 && whatsappResponse.status === 200)
      return 200;
  } catch (error) {
    console.error("Errore nella richiesta:", error);
    alert("Si è verificato un errore durante la richiesta.");
  }
}

module.exports = { signUp, signIn, deleteUser, getUser, modifyUser, logoutUser };

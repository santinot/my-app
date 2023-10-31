const { MongoClient, ObjectId } = require("mongodb");
const user = require("../routes/user");
const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri);

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
      if (user.password === password) {
        return { acknowledged: true, userId: user._id};
      } else {
        return { acknowledged: false, userId: null};
      }
    } else {
      return { acknowledged: false, userId: null };
    }
  } catch (error) {
    return error;
  }
}

async function deleteUser(userid) {
  try {
    await client.connect();
    const database = client.db("App");
    const result = await database
      .collection("users")
      .deleteOne({ _id: new ObjectId(userid) });
    console.log(`User deleted successfully.`);
    return result;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { signUp, signIn, deleteUser };

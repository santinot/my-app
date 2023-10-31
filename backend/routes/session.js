const { MongoClient, ObjectId } = require("mongodb");
const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri);

const session = require("express").Router();

session.post("/create", (req, res) => {
    req.session.user = req.body.userId;
    req.session.save();
    res.status(200).send("session saved");
});

session.get("/user", (req, res) => {
    const sessionuser = req.session.user;
    console.log(sessionuser);
    res.json({ session: sessionuser });
});

session.get("/logout", (req, res) => {
    req.session.destroy();
    res.status(200).send("session destroyed");
});


module.exports = session;


  
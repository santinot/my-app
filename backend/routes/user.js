const user = require("express").Router();
const bcrypt = require("bcryptjs");
const { signUp, signIn, deleteUser, getUser, modifyUser, logoutUser } = require("../functions/userFunction");

user.post("/signup", async (req, res) => {
  try {
    const username = req.body["username"];
    const password = await bcrypt.hash(req.body["password"], 8).then(hash => {
      return hash;
    });
    const userData = await signUp(username, password);
    res.json(userData);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

user.post("/signin", async (req, res) => {
  try {
    const username = req.body["username"];
    const password = req.body["password"];
    const userData = await signIn(username, password);
    res.json(userData);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

user.delete("/delete", async (req, res) => {
  try {
    const userId = req.body["userId"];
    const userData = await deleteUser(userId);
    res.json(userData);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

user.get("/get/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const userData = await getUser(userId);
    res.json(userData);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

user.put("/modify", async (req, res) => {
  try {
    const userId = req.body["userId"];
    const username = req.body["username"];
    const password = await bcrypt.hash(req.body["password"], 8).then(hash => {
      return hash;
    });
    const userData = await modifyUser(userId, username, password);
    res.json(userData);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

user.get("/logout", async (req, res) => {
  try {
    const userData = await logoutUser();
    res.json(userData);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = user;
const user = require("express").Router();
const { signUp, signIn } = require("../functions/userFunction");

user.post("/signup", async (req, res) => {
  try {
    const username = req.body["username"];
    const password = req.body["password"];
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

module.exports = user;

const session = require("express").Router();

session.get("/create/:userId", (req, res) => {
  try {
    req.session.user = req.params.userId;
    req.session.save();
    return res.json({
      status: 200,
      text: "session created " + req.session.user,
    });
  } catch (err) {
    console.log(err);
    return res.json({ status: 500, text: "session not created" });
  }
});

session.get("/user", (req, res) => {
  try {
    const sessionuser = req.session.user;
    res.json({ loggedIn: true, userId: sessionuser });
  } catch (err) {
    console.log(err);
    res.json({ loggedIn: false, userId: null });
  }
});

session.get("/logout", (req, res) => {
  try {
    req.session.destroy();
    res.status(200).send("session destroyed");
  } catch (err) {
    console.log(err);
    res.status(500).send("session not destroyed");
  }
});

module.exports = session;

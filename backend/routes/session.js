const session = require("express").Router();

session.post("/", (req, res) => {
    req.session.user = req.body.user;
    req.session.save();
    res.send("login");
});

session.get("/user", (req, res) => {
    const sessionuser = req.session.user;
    res.send(sessionuser);
});

session.get("/logout", (req, res) => {
    req.session.destroy();
    res.send("logout");
});


module.exports = session;
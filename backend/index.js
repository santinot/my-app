const express = require("express");
const cors = require("cors");
//const ngrok = require("ngrok");

const app = express();
// (async function () {
//   const url = await ngrok.connect();
//   console.log(url);
// })();
// ngrok.connect({
//   proto: "http",
//   addr: 3001,
//   authtoken: "2Vl0njO8rfmukGTnEe9pb7mvQX4_7xx2w1MGbUEXoZG2N3Egx",
//   subdomain: "terribly-credible-boxer",
// }).then((url) => {
//   console.log(url);
// });
// ngrok http --domain=terribly-credible-boxer.ngrok-free.app 3001

app.use(cors());
app.use(express.json());
// http://localhost:3001/
app.get("/", function (req, res) {
  res.send("Hello World");
});
// http://localhost:3001/api
app.use("/api", require("./routes/api"));
// http://localhost:3001/webhooks
app.use("/webhooks", require("./routes/webhook"));

app.listen(3001, () => console.log("Server running on port 3001"));

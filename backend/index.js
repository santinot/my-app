const express = require("express");
const cors = require("cors");
const app = express();
const { Server } = require("socket.io");
const http = require("http");
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
});

app.use((req, res, next) => {
  req.io = io;
  return next();
});

// http://localhost:3001/
app.get("/", function (req, res) {
  res.send("Hello World");
});
// http://localhost:3001/api
app.use("/api", require("./routes/api"));

server.listen(3001, () => console.log("Server running on port 3001"));

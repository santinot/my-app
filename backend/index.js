const express = require("express");
const cors = require("cors");
const app = express();
const { Server } = require("socket.io");
const http = require("http");
const cookieParser = require("cookie-parser");
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

const server = http.createServer(app);

// Socket.io - WebSockets
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
});

app.use((req, res, next) => {
  req.io = io;
  return next();
});

// Endpoint for the API http://localhost:3001/api/...
app.use("/api", require("./routes/api"));

server.listen(3001, () => console.log("Server running on port 3001"));

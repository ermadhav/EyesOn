// ==== BACKEND (server/index.js) ====

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Mongoose Location Schema
mongoose.connect("mongodb://localhost:27017/tracker", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const LocationSchema = new mongoose.Schema({
  uid: String,
  latitude: Number,
  longitude: Number,
  timestamp: { type: Date, default: Date.now }
});

const Location = mongoose.model("Location", LocationSchema);

app.post("/api/location", async (req, res) => {
  const { uid, lat, lng } = req.body;
  await Location.create({ uid, latitude: lat, longitude: lng });
  res.send({ status: "Location saved" });
});

app.get("/api/locations", async (req, res) => {
  const data = await Location.find().sort({ timestamp: -1 });
  res.send(data);
});

io.on("connection", (socket) => {
  console.log("New socket connected: ", socket.id);

  socket.on("join", (roomId) => {
    socket.join(roomId);
  });

  socket.on("offer", (data) => {
    socket.to(data.room).emit("offer", data.offer);
  });

  socket.on("answer", (data) => {
    socket.to(data.room).emit("answer", data.answer);
  });

  socket.on("ice-candidate", (data) => {
    socket.to(data.room).emit("ice-candidate", data.candidate);
  });
});

server.listen(5000, () => console.log("Server running on port 5000"));

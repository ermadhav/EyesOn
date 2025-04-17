const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/userTracker", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  uid: String,
  latitude: Number,
  longitude: Number,
  timestamp: { type: Date, default: Date.now },
});

const UserData = mongoose.model("UserData", userSchema);

app.post("/api/location", async (req, res) => {
  const { uid, lat, lng } = req.body;
  const data = new UserData({ uid, latitude: lat, longitude: lng });
  await data.save();
  res.json({ status: "success" });
});

app.get("/api/locations", async (req, res) => {
  const all = await UserData.find().sort({ timestamp: -1 });
  res.json(all);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

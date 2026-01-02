const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();


const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const socketHandler = require("./socket/socket");
const uploadRoutes = require("./routes/uploadRoutes");
const messageRoutes = require("./routes/messageRoutes");
const path = require("path");
const app = express();
const server = http.createServer(app);

// ---------- MIDDLEWARE ----------
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ---------- ROUTES ----------
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/messages", messageRoutes);

// ---------- SOCKET ----------
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
socketHandler(io);

// ---------- DB ----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    server.listen(5000, () =>
      console.log("🚀 Server running on port 5000")
    );
  })
  .catch((err) => console.error(err));

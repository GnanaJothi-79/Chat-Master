const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const socketHandler = require("./socket/socket");

const app = express();
const server = http.createServer(app);

/* ===================== CONFIG ===================== */
const PORT = process.env.PORT || 5000;

// Allow multiple frontends
const CLIENT_URLS = [
  "http://localhost:5173",
  "https://chat-master-six.vercel.app",
  "https://chat-master-git-main-gnana-jothis-projects.vercel.app"
];

/* ===================== MIDDLEWARE ===================== */
app.use(express.json());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || CLIENT_URLS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

/* ===================== STATIC FILES ===================== */
// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use("/uploads", express.static(uploadDir));

/* ===================== ROUTES ===================== */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.send("Chat API is running successfully");
});

/* ===================== SOCKET.IO ===================== */
const io = new Server(server, {
  cors: {
    origin: CLIENT_URLS,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

socketHandler(io);

/* ===================== DATABASE ===================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

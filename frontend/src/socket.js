// frontend/src/socket.js
import { io } from "socket.io-client";

let socket;

export const connectSocket = () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  socket = io(import.meta.env.VITE_SOCKET_URL, {
    auth: { token }, // 🔑 send token for auth
    transports: ["websocket"], // optional
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("❌ Socket connection error:", err.message);
  });
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};

export const getSocket = () => socket;

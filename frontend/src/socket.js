import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  autoConnect: false, 
  transports: ["websocket"],
});

export const connectSocket = () => {
  const token = localStorage.getItem("token");
  if (!token) return;
  socket.auth = { token };
  socket.connect();
};

export const disconnectSocket = () => {
  socket.disconnect();
};

export default socket;

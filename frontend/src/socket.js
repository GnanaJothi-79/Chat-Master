import { io } from "socket.io-client";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const socket = io(SOCKET_URL, {
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

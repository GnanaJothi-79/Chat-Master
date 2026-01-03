import axios from "axios";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export default axios.create({
  baseURL: SOCKET_URL,
  withCredentials: true, // 🔥 REQUIRED
});

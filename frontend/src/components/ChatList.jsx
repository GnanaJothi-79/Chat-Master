import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket";
const API_URL = import.meta.env.VITE_API_URL;
const ChatList = ({ setSelectedUser }) => {
  const [users, setUsers] = useState([]);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ No token found");
        return;
      }
      try {
        const res = await axios.get(`${API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  // Listen for online/offline status
  useEffect(() => {
    socket.on("userStatus", ({ userId, isOnline }) => {
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isOnline } : u))
      );
    });
    return () => socket.off("userStatus");
  }, []);

  return (
    <div className="p-4 flex-1 overflow-y-auto bg-green-100">
      <h3 className="font-bold font-serif mb-4 text-emerald-900 text-lg">Users</h3>
      {users.map((user, idx) => (
        <div
          key={user._id}
          onClick={() => setSelectedUser(user)}
          className="flex items-center gap-3 py-3 border-b-2  border-emerald-700 cursor-pointer hover:bg-emerald-700 p-2 hover:rounded-md"
        >
          {/* User Avatar */}
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white ${
              user.isOnline ? "bg-green-500" : "bg-emerald-700"
            }`}
          >
            {user.username.slice(0, 2).toUpperCase()}
          </div>

          {/* User Info */}
          <div className="flex-1 flex flex-col">
            <p className="font-bold font-serif text-gray-800">{user.username}</p>
            <p
              className={`text-xs ${
                user.isOnline ? "text-green-500" : "text-gray-400"
              }`}
            >
              {user.isOnline ? "Online" : "Offline"}
            </p>
          </div>

          {/* Online Dot */}
          {user.isOnline && (
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          )}

          {/* Divider Line */}
          {idx !== users.length - 1 && (
            <div className="absolute bottom-0 left-16 right-4 border-b border-gray-300"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatList;

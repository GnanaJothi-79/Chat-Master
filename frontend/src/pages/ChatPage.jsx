import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { connectSocket } from "../socket";
import { useNavigate } from "react-router-dom";
import ChatList from "../components/ChatList";
import ChatHeader from "../components/ChatHeader";
import ChatWindow from "../components/ChatWindow";

const ChatPage = () => {
  const { user } = useContext(AuthContext);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 🔐 If not logged in → go to login page
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    // 🔌 Connect socket once user exists
    connectSocket();
  }, [user, navigate]);

  if (!user) return null; // prevents UI flicker

  return (
    <div className="h-screen flex bg-green-50 overflow-hidden">
      {/* CHAT LIST */}
      <div
        className={`flex flex-col h-full w-full md:w-1/3 border-r border-emerald-200
          ${selectedUser ? "hidden md:flex" : "flex"}`}
      >
        <ChatHeader user={user} />
        <ChatList setSelectedUser={setSelectedUser} />
      </div>

      {/* CHAT WINDOW */}
      <div
        className={`flex flex-col flex-1 h-full
          ${selectedUser ? "flex" : "hidden md:flex"}`}
      >
        {selectedUser ? (
          <ChatWindow
            selectedUser={selectedUser}
            currentUserId={user._id}
            onBack={() => setSelectedUser(null)}
          />
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center
            text-emerald-700 text-lg font-serif">
            Welcome! Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;

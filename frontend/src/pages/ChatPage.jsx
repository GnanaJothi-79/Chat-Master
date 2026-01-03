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
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    connectSocket();
  }, [user, navigate]);

  if (!user) return null; 

  return (
    <div className="h-screen flex bg-green-50 overflow-hidden">
    
      <div
        className={`flex flex-col h-full w-full md:w-1/3 border-r border-emerald-200
          ${selectedUser ? "hidden md:flex" : "flex"}`}
      >
        <ChatHeader user={user} />
        <ChatList setSelectedUser={setSelectedUser} />
      </div>

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

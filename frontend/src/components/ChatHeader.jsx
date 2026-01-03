import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { connectSocket, disconnectSocket } from "../socket";

const ChatHeader = ({ showLogout = true }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    disconnectSocket();
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="flex items-center justify-between p-9 pl-5 pr-5 border-b bg-emerald-950">
      <div className="flex items-center gap-5">
        <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-semibold">
          {user.username.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="font-bold font-serif text-neutral-50">{user.username}</p>
          <p className="text-xs text-green-600">Online</p>
        </div>
      </div>
      {showLogout && (
        <button
          onClick={handleLogout}
          className="text-red-500 hover:text-red-700 "
          title="Logout"
        >
          <LogOut size={22} />
        </button>
      )}
    </div>
  );
};

export default ChatHeader;

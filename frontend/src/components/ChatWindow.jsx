import { useEffect, useState, useRef } from "react";
import axios from "axios";
import socket from "../socket";
import { Trash2, Send, Image as ImageIcon } from "lucide-react";

const ChatWindow = ({ selectedUser, currentUserId, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Clear messages when switching chats
  useEffect(() => {
    setMessages([]);
  }, [selectedUser]);

  // Fetch chat history between current user and selected user
  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(
          `http://localhost:5000/api/messages/${selectedUser._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(res.data); // Only messages between currentUser ↔ selectedUser
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };

    fetchMessages();
  }, [selectedUser]);

  // Listen for incoming messages from socket
  useEffect(() => {
    if (!selectedUser) return;

    const handleMessage = (msg) => {
      const isCurrentChat =
        (msg.senderId === currentUserId && msg.receiverId === selectedUser._id) ||
        (msg.senderId === selectedUser._id && msg.receiverId === currentUserId);

      if (isCurrentChat) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receiveMessage", handleMessage);
    return () => socket.off("receiveMessage", handleMessage);
  }, [selectedUser, currentUserId]);

  // Send message (text + optional image)
  const sendMessage = async () => {
    if (!text && !selectedImage) return;

    let imageUrl = null;
    if (selectedImage) {
      const formData = new FormData();
      formData.append("image", selectedImage);

      try {
        const res = await axios.post(
          "http://localhost:5000/api/upload/image",
          formData
        );
        imageUrl = "http://localhost:5000" + res.data.imageUrl;
      } catch (err) {
        console.error("Image upload failed:", err);
      }
    }

    const msg = {
      senderId: currentUserId,
      receiverId: selectedUser._id,
      message: text,
      image: imageUrl,
      createdAt: new Date(),
    };

    socket.emit("sendMessage", msg);

    setText("");
    setSelectedImage(null);
  };

  // Delete a message
  const deleteMessage = async (id) => {
  try {
    const token = localStorage.getItem("token");

    await axios.delete(
      `http://localhost:5000/api/messages/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setMessages((prev) => prev.filter((m) => m._id !== id));
  } catch (err) {
    console.error("Failed to delete message:", err);
  }
};


  // Group messages by date
  const groupedMessages = [];
  let lastDate = null;
  messages.forEach((msg) => {
    const date = new Date(msg.createdAt).toDateString();
    if (date !== lastDate) {
      groupedMessages.push({ type: "date", date });
      lastDate = date;
    }
    groupedMessages.push({ type: "msg", ...msg });
  });

  const initials = selectedUser.username.slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col h-full min-h-0 bg-white relative">
      {/* HEADER */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-emerald-900">
        <button onClick={onBack} className="md:hidden text-xl font-bold text-white">
          ←
        </button>
        <div className="w-10 h-10 rounded-full bg-emerald-700 text-green-400 flex items-center justify-center font-semibold">
          {initials}
        </div>
        <div>
          <p className="font-semibold font-serif text-neutral-50">{selectedUser.username}</p>
          <p className="text-xs text-neutral-50">{selectedUser.isOnline ? "Online" : "Offline"}</p>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 bg-green-100 relative">
        {groupedMessages.map((item, i) =>
          item.type === "date" ? (
            <div key={i} className="text-center text-gray-400 text-sm my-3">
              {item.date === new Date().toDateString() ? "Today" : item.date}
            </div>
          ) : (
            <div
              key={i}
              className={`max-w-[75%] mb-3 p-3 rounded-lg w-96 shadow relative
                ${item.senderId === currentUserId
                  ? "ml-auto bg-emerald-500 text-white font-serif hover:bg-green-600"
                  : "mr-auto bg-emerald-950 text-white font-serif hover:bg-emerald-800"
                }`}
            >
              {item.message && <p>{item.message}</p>}
              {item.image && (
                <img
                  src={item.image}
                  alt="sent"
                  className="mt-2 rounded-lg max-w-full bg-emerald-700"
                />
              )}
              <p className="text-[10px] font-mono text-right opacity-70 mt-1">
                {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>

              {/* Delete Icon */}
              {item.senderId === currentUserId && (
                <button
                  className="absolute top-1 right-1 p-1 text-red-600 hover:text-red-800"
                  onClick={() => deleteMessage(item._id)}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          )
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* IMAGE PREVIEW */}
      {selectedImage && (
        <div className="px-4 py-2 border-t bg-emerald-200">
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="preview"
            className="w-24 h-24 rounded-lg object-cover"
          />
        </div>
      )}

      {/* INPUT BAR */}
      <div className="sticky bottom-0 z-10 bg-green-100 border-t px-2 py-2 flex items-center gap-2 pb-[env(safe-area-inset-bottom)]">
        <label className="cursor-pointer w-11 h-11 rounded-full bg-teal-900 text-white flex items-center justify-center p-2 active:scale-95">
          <ImageIcon size={20} />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setSelectedImage(e.target.files[0])}
          />
        </label>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message..."
          className="flex-1 min-w-0 border rounded-full px-4 py-2 outline-none font-serif bg-teal-800 text-neutral-50 focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={sendMessage}
          className="w-11 h-11 rounded-full hover:bg-green-600 bg-teal-800 text-white flex items-center justify-center active:scale-95"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;

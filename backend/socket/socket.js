const jwt = require("jsonwebtoken");
const Message = require("../models/Message");
const User = require("../models/User");

const socketHandler = (io) => {

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("No token provided"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;

      next();
    } catch (err) {
      console.log("❌ Socket auth failed");
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", async (socket) => {
    console.log("✅ User connected:", socket.userId);

    await User.findByIdAndUpdate(socket.userId, { isOnline: true });

    socket.join(socket.userId);

    socket.broadcast.emit("userStatus", {
      userId: socket.userId,
      isOnline: true,
    });

    socket.on("sendMessage", async ({ receiverId, message, image }) => {
      try {
        if (!receiverId) return;

        const newMessage = await Message.create({
          senderId: socket.userId,
          receiverId,
          message: message || null,
          image: image || null,
          status: "sent",
        });
        io.to(receiverId).emit("receiveMessage", newMessage);
        io.to(socket.userId).emit("receiveMessage", newMessage);
      } catch (err) {
        console.log("❌ Message error:", err.message);
      }
    });

    socket.on("deleteMessage", async ({ msgId, receiverId }) => {
      try {
        await Message.findByIdAndDelete(msgId);
        io.to(receiverId).emit("messageDeleted", msgId);
        io.to(socket.userId).emit("messageDeleted", msgId);
      } catch (err) {
        console.log("❌ Delete msg error:", err.message);
      }
    });

    socket.on("disconnect", async () => {
      await User.findByIdAndUpdate(socket.userId, { isOnline: false });

      socket.broadcast.emit("userStatus", {
        userId: socket.userId,
        isOnline: false,
      });

      console.log("❌ User disconnected:", socket.userId);
    });
  });
};

module.exports = socketHandler;
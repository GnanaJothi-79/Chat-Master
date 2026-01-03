const express = require("express");
const mongoose = require("mongoose"); 
const Message = require("../models/Message");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all messages between logged-in user and selected user
router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user._id, receiverId: req.params.userId },
        { senderId: req.params.userId, receiverId: req.user._id },
      ],
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

// Delete a message
router.delete("/:msgId", authMiddleware, async (req, res) => {
  try {
    const { msgId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(msgId)) {
      return res.status(400).json({ message: "Invalid message ID" });
    }

    const msg = await Message.findById(msgId);
    if (!msg) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (msg.senderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await msg.deleteOne();

    res.json({ message: "Message deleted", msgId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete message" });
  }
});

module.exports = router;
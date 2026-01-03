const express = require("express");
const Message = require("../models/Message");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:receiverId", authMiddleware, async (req, res) => {
  const messages = await Message.find({
    $or: [
      { senderId: req.user.id, receiverId: req.params.receiverId },
      { senderId: req.params.receiverId, receiverId: req.user.id },
    ],
  }).sort({ createdAt: 1 });

  res.json(messages);
});

module.exports = router;

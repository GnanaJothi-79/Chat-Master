const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: { type: String },
     image: { type: String },
    status: {type: String,enum: ["sent", "delivered", "seen"],
  default: "sent",
}

  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);

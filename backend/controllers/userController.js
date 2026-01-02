const User = require("../models/User");

// GET ALL USERS (except current user)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find(
      { _id: { $ne: req.user._id } }, // exclude self
      "-password"
    );

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

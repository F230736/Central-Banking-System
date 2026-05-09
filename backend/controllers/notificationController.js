const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
  try {
    const notes = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json(err.message);
  }
};
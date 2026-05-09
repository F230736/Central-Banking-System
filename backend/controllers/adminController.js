const User = require("../models/User");
const Transaction = require("../models/Transaction");
const AuditLog = require("../models/AuditLog");

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTransactions = await Transaction.countDocuments();
    const totalLogs = await AuditLog.countDocuments();
    const totalMoneyTransferred = await Transaction.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);
    res.json({ totalUsers, totalTransactions, totalLogs, totalMoneyTransferred });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate("sender").populate("receiver").sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().populate("user").sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json(error.message);
  }
};
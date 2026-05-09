const mongoose = require("mongoose");
const Account = require("../models/Account");
const Transaction = require("../models/Transaction");
const AuditLog = require("../models/AuditLog");
const User = require("../models/User");
const Notification = require("../models/Notification");

exports.transferMoney = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { senderId, receiverEmail, amount } = req.body;
    if (!senderId || !receiverEmail || !amount) return res.status(400).json("All fields are required");
    if (amount <= 0) return res.status(400).json("Invalid amount");

    const sender = await Account.findById(senderId).session(session);
    if (!sender) throw new Error("Sender account not found");

    const receiverUser = await User.findOne({ email: receiverEmail });
    if (!receiverUser) throw new Error("Receiver email not found");

    const receiver = await Account.findOne({ user: receiverUser._id }).session(session);
    if (!receiver) throw new Error("Receiver account not found");

    if (sender._id.toString() === receiver._id.toString()) throw new Error("Cannot transfer to yourself");
    if (sender.balance < amount) throw new Error("Insufficient Balance");

    sender.balance -= amount;
    receiver.balance += amount;
    await sender.save({ session });
    await receiver.save({ session });

    const transaction = await Transaction.create([{
      sender: sender._id,
      receiver: receiver._id,
      amount,
      type: "transfer"
    }], { session });

    await AuditLog.create([{
      user: sender.user,
      action: "TRANSFER",
      details: `Transferred PKR ${amount} to ${receiverEmail}`
    }], { session });

    const senderUser = await User.findById(sender.user);
    await Notification.create([{
      user: receiver.user,
      message: `PKR ${amount} received from ${senderUser.name}`
    }], { session });

    await Notification.create([{
      user: sender.user,
      message: `PKR ${amount} sent to ${receiverUser.email}`
    }], { session });

    await session.commitTransaction();
    session.endSession();
    res.json({ message: "Transfer Successful", transaction: transaction[0] });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json(error.message);
  }
};

exports.getTransactionHistory = async (req, res) => {
  try {
    const accountId = req.params.accountId;
    const transactions = await Transaction.find({
      $or: [{ sender: accountId }, { receiver: accountId }]
    }).populate("sender").populate("receiver").sort({ createdAt: -1 });

    const formattedTransactions = transactions.map(transaction => {
      const transactionObj = transaction.toObject();
      if (transaction.sender?._id.toString() === accountId) {
        transactionObj.displayType = "sent";
      } else if (transaction.receiver?._id.toString() === accountId) {
        transactionObj.displayType = "received";
      }
      return transactionObj;
    });
    res.json(formattedTransactions);
  } catch (error) {
    res.status(500).json(error.message);
  }
};
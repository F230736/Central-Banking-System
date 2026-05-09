const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
  amount: Number,
  type: String
}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);
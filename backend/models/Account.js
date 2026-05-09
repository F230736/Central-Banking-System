const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  accountNumber: { type: String, unique: true },
  balance: { type: Number, default: 0 },
  status: { type: String, default: "active" }
});

module.exports = mongoose.model("Account", accountSchema);
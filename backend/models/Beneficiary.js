const mongoose = require("mongoose");

const beneficiarySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  beneficiaryAccount: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  nickname: { type: String, default: "Saved Beneficiary" }
}, { timestamps: true });

module.exports = mongoose.model("Beneficiary", beneficiarySchema);
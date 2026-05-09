const mongoose = require("mongoose");

const auditSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: String,
  details: String
}, { timestamps: true });

module.exports = mongoose.model("AuditLog", auditSchema);
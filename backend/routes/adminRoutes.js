const express = require("express");
const router = express.Router();
const { getStats, getAllUsers, getAllTransactions, getAuditLogs } = require("../controllers/adminController");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

router.get("/stats", protect, adminOnly, getStats);
router.get("/users", protect, adminOnly, getAllUsers);
router.get("/transactions", protect, adminOnly, getAllTransactions);
router.get("/logs", protect, adminOnly, getAuditLogs);

module.exports = router;
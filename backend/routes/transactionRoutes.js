const express = require("express");
const router = express.Router();
const { transferMoney, getTransactionHistory } = require("../controllers/transactionController");
const protect = require("../middleware/authMiddleware");

router.post("/transfer", protect, transferMoney);
router.get("/history/:accountId", protect, getTransactionHistory);

module.exports = router;
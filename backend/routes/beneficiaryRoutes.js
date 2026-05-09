const express = require("express");
const router = express.Router();
const { addBeneficiary, getBeneficiaries, deleteBeneficiary } = require("../controllers/beneficiaryController");
const protect = require("../middleware/authMiddleware");

router.post("/add", protect, addBeneficiary);
router.get("/", protect, getBeneficiaries);
router.delete("/:id", protect, deleteBeneficiary);

module.exports = router;
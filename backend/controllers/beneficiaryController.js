const Beneficiary = require("../models/Beneficiary");
const User = require("../models/User");

exports.addBeneficiary = async (req, res) => {
  try {
    const { email, nickname } = req.body;
    const beneficiaryUser = await User.findOne({ email });
    if (!beneficiaryUser) return res.status(404).json("User not found");

    const existing = await Beneficiary.findOne({ user: req.user.id, beneficiaryAccount: beneficiaryUser._id });
    if (existing) return res.status(400).json("Beneficiary already exists");

    const beneficiary = await Beneficiary.create({ user: req.user.id, beneficiaryAccount: beneficiaryUser._id, nickname });
    res.json(beneficiary);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.getBeneficiaries = async (req, res) => {
  try {
    const beneficiaries = await Beneficiary.find({ user: req.user.id }).populate("beneficiaryAccount", "name email");
    res.json(beneficiaries);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.deleteBeneficiary = async (req, res) => {
  try {
    await Beneficiary.findByIdAndDelete(req.params.id);
    res.json("Beneficiary removed");
  } catch (error) {
    res.status(500).json(error.message);
  }
};
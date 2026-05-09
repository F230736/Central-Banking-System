const User = require("../models/User");
const Account = require("../models/Account");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json("Email already registered");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    const account = await Account.create({
      user: user._id,
      accountNumber: Math.floor(100000000 + Math.random() * 900000000),
      balance: 0,
      status: "active"
    });

    res.json({ message: "User & Account created successfully", user, account });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json("User not found");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json("Invalid Password");

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    const account = await Account.findOne({ user: user._id });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role }, account });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const account = await Account.findOne({ user: req.user.id });
    if (!account) return res.status(404).json({ message: "Account not found" });
    res.json({ user, account });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json("Old password is incorrect");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.json("Password updated successfully");
  } catch (error) {
    res.status(500).json(error.message);
  }
};
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) return res.status(401).json("No token provided");
    if (token.startsWith("Bearer ")) token = token.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json("User no longer exists");

    req.user = { id: user._id.toString(), role: user.role, email: user.email };
    next();
  } catch (error) {
    res.status(401).json("Invalid or expired token");
  }
};

module.exports = protect;
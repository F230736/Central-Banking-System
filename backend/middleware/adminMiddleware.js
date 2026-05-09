module.exports = (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json("Unauthorized: No user found");
    if (req.user.role !== "admin") return res.status(403).json("Access denied: Admin only");
    next();
  } catch (error) {
    return res.status(500).json("Server error in admin middleware");
  }
};
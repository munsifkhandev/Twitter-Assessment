const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const tokenHeader = req.header("Authorization");
  if (!tokenHeader) {
    return res.status(401).json({
      success: false,
      message: "Access Denied. No Token Provided.",
    });
  }
  try {
    const token = tokenHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access Denied. Token format incorrect.",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid Token.",
    });
  }
};

module.exports = authMiddleware;

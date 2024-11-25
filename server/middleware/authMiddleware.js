const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get token from Authorization header
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = decoded; // Attach decoded user to request
    next(); // Proceed to next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: "Invalid token", error });
  }
};

module.exports = authMiddleware;

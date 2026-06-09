const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "gkj-wates-secret-key";

// Memverifikasi JWT dari header Authorization: Bearer <token>
const authenticate = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token tidak valid atau kedaluwarsa" });
  }
};

module.exports = { authenticate };

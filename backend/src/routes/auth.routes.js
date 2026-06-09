const express = require("express");
const router = express.Router();

const { login, forgotPassword, me } = require("../controllers/auth.controller");
const { authenticate } = require("../middleware/auth.middleware");

router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.get("/me", authenticate, me);

module.exports = router;

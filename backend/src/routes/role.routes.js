const express = require("express");
const router = express.Router();

const { getRoles } = require("../controllers/role.controller");
const { authenticate } = require("../middleware/auth.middleware");

router.use(authenticate);

router.get("/", getRoles);

module.exports = router;

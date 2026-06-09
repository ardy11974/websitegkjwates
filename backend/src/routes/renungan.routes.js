const express = require("express");
const router = express.Router();

const {
  getRenungan,
  createRenungan,
  updateRenungan,
  deleteRenungan,
} = require("../controllers/renungan.controller");
const { authenticate } = require("../middleware/auth.middleware");

router.use(authenticate);

router.get("/", getRenungan);
router.post("/", createRenungan);
router.put("/:id", updateRenungan);
router.delete("/:id", deleteRenungan);

module.exports = router;

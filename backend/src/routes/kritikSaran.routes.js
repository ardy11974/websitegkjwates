const express = require("express");
const router = express.Router();

const {
  getKritikSaran,
  markAsRead,
  deleteKritikSaran,
} = require("../controllers/kritikSaran.controller");
const { authenticate } = require("../middleware/auth.middleware");

router.use(authenticate);

router.get("/", getKritikSaran);
router.patch("/:id/read", markAsRead);
router.delete("/:id", deleteKritikSaran);

module.exports = router;

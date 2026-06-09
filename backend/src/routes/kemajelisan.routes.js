const express = require("express");
const router = express.Router();

const {
  getKemajelisan,
  getKemajelisanById,
  createKemajelisan,
  updateKemajelisan,
  deleteKemajelisan,
} = require("../controllers/kemajelisan.controller");
const { authenticate } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

router.use(authenticate);

router.get("/", getKemajelisan);
router.get("/:id", getKemajelisanById);
router.post("/", upload.single("foto"), createKemajelisan);
router.put("/:id", upload.single("foto"), updateKemajelisan);
router.delete("/:id", deleteKemajelisan);

module.exports = router;

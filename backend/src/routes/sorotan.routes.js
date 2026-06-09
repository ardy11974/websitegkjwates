const express = require("express");
const router = express.Router();

const {
  getSorotan,
  createSorotan,
  updateSorotan,
  deleteSorotan,
} = require("../controllers/sorotan.controller");
const { authenticate } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

router.use(authenticate);

router.get("/", getSorotan);
router.post("/", upload.single("gambar"), createSorotan);
router.put("/:id", upload.single("gambar"), updateSorotan);
router.delete("/:id", deleteSorotan);

module.exports = router;

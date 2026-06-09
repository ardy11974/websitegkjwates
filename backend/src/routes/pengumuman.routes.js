const express = require("express");
const router = express.Router();

const {
  getPengumuman,
  getPengumumanById,
  createPengumuman,
  updatePengumuman,
  deletePengumuman,
  createKonten,
  updateKonten,
  deleteKonten,
} = require("../controllers/pengumuman.controller");
const { authenticate } = require("../middleware/auth.middleware");

router.use(authenticate);

// Konten (di dalam wadah) - definisikan sebelum /:id agar tidak tertangkap
router.post("/konten", createKonten);
router.put("/konten/:id", updateKonten);
router.delete("/konten/:id", deleteKonten);

// Pengumuman (wadah)
router.get("/", getPengumuman);
router.get("/:id", getPengumumanById);
router.post("/", createPengumuman);
router.put("/:id", updatePengumuman);
router.delete("/:id", deletePengumuman);

module.exports = router;

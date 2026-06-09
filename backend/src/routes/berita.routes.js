const express = require("express");
const router = express.Router();

const {
  getBerita,
  createBerita,
  updateBerita,
  deleteBerita,
  getKategori,
  createKategori,
  updateKategori,
  deleteKategori,
} = require("../controllers/berita.controller");
const { authenticate } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

router.use(authenticate);

// Kategori (master data untuk berita)
router.get("/kategori", getKategori);
router.post("/kategori", createKategori);
router.put("/kategori/:id", updateKategori);
router.delete("/kategori/:id", deleteKategori);

router.get("/", getBerita);
router.post("/", upload.single("gambar"), createBerita);
router.put("/:id", upload.single("gambar"), updateBerita);
router.delete("/:id", deleteBerita);

module.exports = router;

const express = require("express");
const router = express.Router();

const {
  getKegiatan,
  createKegiatan,
  updateKegiatan,
  deleteKegiatan,
  getKomisi,
  createKomisi,
  updateKomisi,
  deleteKomisi,
} = require("../controllers/kegiatan.controller");
const { authenticate } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

router.use(authenticate);

// Komisi (master data untuk kegiatan)
router.get("/komisi", getKomisi);
router.post("/komisi", createKomisi);
router.put("/komisi/:id", updateKomisi);
router.delete("/komisi/:id", deleteKomisi);

router.get("/", getKegiatan);
router.post("/", upload.single("gambar"), createKegiatan);
router.put("/:id", upload.single("gambar"), updateKegiatan);
router.delete("/:id", deleteKegiatan);

module.exports = router;

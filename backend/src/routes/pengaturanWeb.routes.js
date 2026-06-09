const express = require("express");
const router = express.Router();

const {
  getPengaturan,
  upsertPengaturan,
} = require("../controllers/pengaturanWeb.controller");
const { authenticate } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

// GET publik (dipakai juga oleh halaman depan), simpan hanya untuk admin
router.get("/", getPengaturan);
router.put("/", authenticate, upload.single("gambar_landing"), upsertPengaturan);

module.exports = router;

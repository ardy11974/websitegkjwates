const express = require("express");
const router = express.Router();

const {
  getJadwal,
  getSorotan,
  getPengumuman,
  getKegiatan,
  getBerita,
  getBeritaById,
  getKomisi,
  getKemajelisan,
  getRenungan,
  getRenunganById,
  createKritikSaran,
  getPersyaratan,
} = require("../controllers/public.controller");

// Semua endpoint publik (tanpa autentikasi) untuk halaman depan
router.get("/jadwal", getJadwal);
router.get("/sorotan", getSorotan);
router.get("/pengumuman", getPengumuman);
router.get("/kegiatan", getKegiatan);
router.get("/berita", getBerita);
router.get("/berita/:id", getBeritaById);
router.get("/komisi", getKomisi);
router.get("/kemajelisan", getKemajelisan);
router.get("/renungan", getRenungan);
router.get("/renungan/:id", getRenunganById);
router.get("/persyaratan", getPersyaratan);
router.post("/kritik-saran", createKritikSaran);

module.exports = router;

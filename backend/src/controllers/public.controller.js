const prisma = require("../config/prisma");

// Label komisi untuk renungan berdasarkan role pembuatnya
const KOMISI_LABEL = {
  kompa: "Komisi Pemuda",
  komnak: "Komisi Anak",
  pendeta: "Pendeta",
};
const komisiFromRole = (role) => KOMISI_LABEL[role] || "Umum";

// Jadwal ibadah untuk JadwalSection: hanya ibadah yang dipublish, beserta jadwalnya
const getJadwal = async (req, res) => {
  try {
    const data = await prisma.ibadah.findMany({
      where: { status_publish_ibadah: "PUBLISH" },
      include: { jadwalIbadah: { orderBy: { id_jadwalIbadah: "asc" } } },
      orderBy: { id_ibadah: "asc" },
    });
    res.json(data);
  } catch (error) {
    console.error("public getJadwal error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Sorotan yang dipublish untuk SorotanSection
const getSorotan = async (req, res) => {
  try {
    const data = await prisma.sorotan.findMany({
      where: { status_publish_sorotan: "PUBLISH" },
      orderBy: { id_sorotan: "desc" },
    });
    res.json(data);
  } catch (error) {
    console.error("public getSorotan error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Pengumuman (warta jemaat) yang dipublish: tiap "kertas" beserta kontennya, terbaru dulu
const getPengumuman = async (req, res) => {
  try {
    const data = await prisma.pengumuman.findMany({
      where: { status_pengumuman: "PUBLISH" },
      include: {
        konten_pengumuman: { orderBy: { id_kontenPengumuman: "asc" } },
      },
      orderBy: { tanggal_publish: "desc" },
    });
    res.json(data);
  } catch (error) {
    console.error("public getPengumuman error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Kegiatan yang tampil (PUBLISH atau SELESAI)
const getKegiatan = async (req, res) => {
  try {
    const data = await prisma.kegiatan.findMany({
      where: { status_kegiatan: { in: ["PUBLISH", "SELESAI"] } },
      include: { komisi: { select: { nama_komisi: true } } },
      orderBy: { tanggal_kegiatan: "desc" },
    });
    res.json(data);
  } catch (error) {
    console.error("public getKegiatan error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Berita yang dipublish
const getBerita = async (req, res) => {
  try {
    const data = await prisma.berita.findMany({
      where: { status_berita: "PUBLISH" },
      include: { kategori: { select: { nama_kategori: true } } },
      orderBy: { tanggal_berita: "desc" },
    });
    res.json(data);
  } catch (error) {
    console.error("public getBerita error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getBeritaById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = await prisma.berita.findFirst({
      where: { id_berita: id, status_berita: "PUBLISH" },
      include: { kategori: { select: { nama_kategori: true } } },
    });
    if (!data) return res.status(404).json({ message: "Berita tidak ditemukan" });
    res.json(data);
  } catch (error) {
    console.error("public getBeritaById error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Kirim kritik & saran dari halaman depan (publik, tanpa login)
const createKritikSaran = async (req, res) => {
  try {
    const { nama_pengirim, email_pengirim, isi_pesan } = req.body;
    if (!isi_pesan || !isi_pesan.trim()) {
      return res.status(400).json({ message: "Pesan tidak boleh kosong" });
    }
    const data = await prisma.kritikSaran.create({
      data: {
        nama_pengirim: nama_pengirim?.trim() || null,
        email_pengirim: email_pengirim?.trim() || null,
        isi_pesan: isi_pesan.trim(),
      },
    });
    res.status(201).json({ message: "Terima kasih atas masukan Anda", data });
  } catch (error) {
    console.error("public createKritikSaran error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Daftar persyaratan (kategori + file PDF) untuk AktifitasSection
const getPersyaratan = async (req, res) => {
  try {
    const data = await prisma.persyaratan.findMany({
      select: {
        id_persyaratan: true,
        kategori_persyaratan: true,
        file_pdf: true,
      },
      orderBy: { id_persyaratan: "asc" },
    });
    res.json(data);
  } catch (error) {
    console.error("public getPersyaratan error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Kemajelisan untuk KemajelisanPage (urut berdasarkan urutan)
const getKemajelisan = async (req, res) => {
  try {
    const data = await prisma.kemajelisan.findMany({
      orderBy: { urutan_kemajelisan: "asc" },
    });
    res.json(data);
  } catch (error) {
    console.error("public getKemajelisan error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Daftar komisi (untuk filter KegiatanPage agar tetap tampil walau kosong)
const getKomisi = async (req, res) => {
  try {
    const data = await prisma.komisi.findMany({
      select: { id_komisi: true, nama_komisi: true },
      orderBy: { id_komisi: "asc" },
    });
    res.json(data);
  } catch (error) {
    console.error("public getKomisi error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Renungan yang dipublish (untuk RenunganPage list + filter komisi)
const getRenungan = async (req, res) => {
  try {
    const rows = await prisma.renungan.findMany({
      where: { status_renungan: "PUBLISH" },
      include: { user: { select: { role: { select: { nama_role: true } } } } },
      orderBy: { tanggal_renungan: "desc" },
    });
    const data = rows.map((r) => ({
      id_renungan: r.id_renungan,
      judul_renungan: r.judul_renungan,
      bacaan_renungan: r.bacaan_renungan,
      nats_renungan: r.nats_renungan,
      isi_renungan: r.isi_renungan,
      penulis_renungan: r.penulis_renungan,
      tanggal_renungan: r.tanggal_renungan,
      komisi: komisiFromRole(r.user?.role?.nama_role),
    }));
    res.json(data);
  } catch (error) {
    console.error("public getRenungan error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getRenunganById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const r = await prisma.renungan.findFirst({
      where: { id_renungan: id, status_renungan: "PUBLISH" },
      include: { user: { select: { role: { select: { nama_role: true } } } } },
    });
    if (!r) return res.status(404).json({ message: "Renungan tidak ditemukan" });
    res.json({
      id_renungan: r.id_renungan,
      judul_renungan: r.judul_renungan,
      bacaan_renungan: r.bacaan_renungan,
      nats_renungan: r.nats_renungan,
      isi_renungan: r.isi_renungan,
      penulis_renungan: r.penulis_renungan,
      tanggal_renungan: r.tanggal_renungan,
      komisi: komisiFromRole(r.user?.role?.nama_role),
    });
  } catch (error) {
    console.error("public getRenunganById error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
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
};

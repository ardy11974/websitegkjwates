const path = require("path");
const fs = require("fs");
const prisma = require("../config/prisma");
const { uploadDir } = require("../middleware/upload.middleware");

const removeFile = (filePath) => {
  if (!filePath) return;
  try {
    const full = path.join(uploadDir, path.basename(filePath));
    if (fs.existsSync(full)) fs.unlinkSync(full);
  } catch (e) {
    console.error("Gagal menghapus file:", e.message);
  }
};

const getBerita = async (req, res) => {
  try {
    const data = await prisma.berita.findMany({
      include: { kategori: { select: { id_kategori: true, nama_kategori: true } } },
      orderBy: { id_berita: "desc" },
    });
    res.json(data);
  } catch (error) {
    console.error("getBerita error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const createBerita = async (req, res) => {
  try {
    const {
      judul_berita,
      isi_berita,
      penulis_berita,
      tanggal_berita,
      status_berita,
      id_kategori,
    } = req.body;

    if (!judul_berita || !isi_berita || !penulis_berita || !id_kategori) {
      if (req.file) removeFile(req.file.filename);
      return res.status(400).json({
        message: "Judul, isi, penulis, dan kategori harus diisi",
      });
    }

    const data = await prisma.berita.create({
      data: {
        id_user: req.user.id_user,
        id_kategori: Number(id_kategori),
        judul_berita,
        isi_berita,
        penulis_berita,
        tanggal_berita: tanggal_berita ? new Date(tanggal_berita) : new Date(),
        status_berita: status_berita === "PUBLISH" ? "PUBLISH" : "DRAFT",
        gambar_berita: req.file ? `/uploads/${req.file.filename}` : null,
      },
    });
    res.status(201).json({ message: "Berita berhasil dibuat", data });
  } catch (error) {
    console.error("createBerita error:", error);
    if (req.file) removeFile(req.file.filename);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateBerita = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const {
      judul_berita,
      isi_berita,
      penulis_berita,
      tanggal_berita,
      status_berita,
      id_kategori,
    } = req.body;

    const existing = await prisma.berita.findUnique({ where: { id_berita: id } });
    if (!existing) {
      if (req.file) removeFile(req.file.filename);
      return res.status(404).json({ message: "Berita tidak ditemukan" });
    }

    const gambar = req.file
      ? `/uploads/${req.file.filename}`
      : existing.gambar_berita;

    const data = await prisma.berita.update({
      where: { id_berita: id },
      data: {
        judul_berita: judul_berita ?? existing.judul_berita,
        isi_berita: isi_berita ?? existing.isi_berita,
        penulis_berita: penulis_berita ?? existing.penulis_berita,
        tanggal_berita: tanggal_berita
          ? new Date(tanggal_berita)
          : existing.tanggal_berita,
        status_berita: status_berita
          ? status_berita === "PUBLISH"
            ? "PUBLISH"
            : "DRAFT"
          : existing.status_berita,
        id_kategori: id_kategori ? Number(id_kategori) : existing.id_kategori,
        gambar_berita: gambar,
      },
    });

    if (req.file && existing.gambar_berita) removeFile(existing.gambar_berita);

    res.json({ message: "Berita berhasil diperbarui", data });
  } catch (error) {
    console.error("updateBerita error:", error);
    if (req.file) removeFile(req.file.filename);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteBerita = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.berita.findUnique({ where: { id_berita: id } });
    if (!existing)
      return res.status(404).json({ message: "Berita tidak ditemukan" });

    await prisma.berita.delete({ where: { id_berita: id } });
    removeFile(existing.gambar_berita);

    res.json({ message: "Berita berhasil dihapus" });
  } catch (error) {
    console.error("deleteBerita error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Dropdown / daftar kategori
const getKategori = async (req, res) => {
  try {
    const data = await prisma.kategori.findMany({
      orderBy: { id_kategori: "asc" },
    });
    res.json(data);
  } catch (error) {
    console.error("getKategori error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const createKategori = async (req, res) => {
  try {
    const { nama_kategori } = req.body;
    if (!nama_kategori || !nama_kategori.trim()) {
      return res.status(400).json({ message: "Nama kategori harus diisi" });
    }
    const data = await prisma.kategori.create({
      data: {
        id_user: req.user.id_user,
        nama_kategori: nama_kategori.trim(),
      },
    });
    res.status(201).json({ message: "Kategori berhasil dibuat", data });
  } catch (error) {
    console.error("createKategori error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateKategori = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nama_kategori } = req.body;
    if (!nama_kategori || !nama_kategori.trim()) {
      return res.status(400).json({ message: "Nama kategori harus diisi" });
    }
    const existing = await prisma.kategori.findUnique({
      where: { id_kategori: id },
    });
    if (!existing)
      return res.status(404).json({ message: "Kategori tidak ditemukan" });

    const data = await prisma.kategori.update({
      where: { id_kategori: id },
      data: { nama_kategori: nama_kategori.trim() },
    });
    res.json({ message: "Kategori berhasil diperbarui", data });
  } catch (error) {
    console.error("updateKategori error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteKategori = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.kategori.findUnique({
      where: { id_kategori: id },
    });
    if (!existing)
      return res.status(404).json({ message: "Kategori tidak ditemukan" });

    const terpakai = await prisma.berita.count({ where: { id_kategori: id } });
    if (terpakai > 0) {
      return res.status(409).json({
        message: `Kategori tidak dapat dihapus karena masih dipakai ${terpakai} berita`,
      });
    }

    await prisma.kategori.delete({ where: { id_kategori: id } });
    res.json({ message: "Kategori berhasil dihapus" });
  } catch (error) {
    console.error("deleteKategori error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getBerita,
  createBerita,
  updateBerita,
  deleteBerita,
  getKategori,
  createKategori,
  updateKategori,
  deleteKategori,
};

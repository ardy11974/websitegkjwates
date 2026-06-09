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

const VALID_STATUS = ["DRAFT", "PUBLISH", "SELESAI"];

const getKegiatan = async (req, res) => {
  try {
    const data = await prisma.kegiatan.findMany({
      include: { komisi: { select: { id_komisi: true, nama_komisi: true } } },
      orderBy: { id_kegiatan: "desc" },
    });
    res.json(data);
  } catch (error) {
    console.error("getKegiatan error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const createKegiatan = async (req, res) => {
  try {
    const {
      judul_kegiatan,
      deskripsi_kegiatan,
      tanggal_kegiatan,
      lokasi_kegiatan,
      status_kegiatan,
      id_komisi,
    } = req.body;

    if (!judul_kegiatan || !deskripsi_kegiatan || !lokasi_kegiatan || !id_komisi) {
      if (req.file) removeFile(req.file.filename);
      return res.status(400).json({
        message: "Judul, deskripsi, lokasi, dan komisi harus diisi",
      });
    }

    const data = await prisma.kegiatan.create({
      data: {
        id_user: req.user.id_user,
        id_komisi: Number(id_komisi),
        judul_kegiatan,
        deskripsi_kegiatan,
        lokasi_kegiatan,
        tanggal_kegiatan: tanggal_kegiatan ? new Date(tanggal_kegiatan) : new Date(),
        status_kegiatan: VALID_STATUS.includes(status_kegiatan)
          ? status_kegiatan
          : "DRAFT",
        gambar_kegiatan: req.file ? `/uploads/${req.file.filename}` : null,
      },
    });
    res.status(201).json({ message: "Kegiatan berhasil dibuat", data });
  } catch (error) {
    console.error("createKegiatan error:", error);
    if (req.file) removeFile(req.file.filename);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateKegiatan = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const {
      judul_kegiatan,
      deskripsi_kegiatan,
      tanggal_kegiatan,
      lokasi_kegiatan,
      status_kegiatan,
      id_komisi,
    } = req.body;

    const existing = await prisma.kegiatan.findUnique({
      where: { id_kegiatan: id },
    });
    if (!existing) {
      if (req.file) removeFile(req.file.filename);
      return res.status(404).json({ message: "Kegiatan tidak ditemukan" });
    }

    const gambar = req.file
      ? `/uploads/${req.file.filename}`
      : existing.gambar_kegiatan;

    const data = await prisma.kegiatan.update({
      where: { id_kegiatan: id },
      data: {
        judul_kegiatan: judul_kegiatan ?? existing.judul_kegiatan,
        deskripsi_kegiatan: deskripsi_kegiatan ?? existing.deskripsi_kegiatan,
        lokasi_kegiatan: lokasi_kegiatan ?? existing.lokasi_kegiatan,
        tanggal_kegiatan: tanggal_kegiatan
          ? new Date(tanggal_kegiatan)
          : existing.tanggal_kegiatan,
        status_kegiatan: VALID_STATUS.includes(status_kegiatan)
          ? status_kegiatan
          : existing.status_kegiatan,
        id_komisi: id_komisi ? Number(id_komisi) : existing.id_komisi,
        gambar_kegiatan: gambar,
      },
    });

    if (req.file && existing.gambar_kegiatan) removeFile(existing.gambar_kegiatan);

    res.json({ message: "Kegiatan berhasil diperbarui", data });
  } catch (error) {
    console.error("updateKegiatan error:", error);
    if (req.file) removeFile(req.file.filename);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteKegiatan = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.kegiatan.findUnique({
      where: { id_kegiatan: id },
    });
    if (!existing)
      return res.status(404).json({ message: "Kegiatan tidak ditemukan" });

    await prisma.kegiatan.delete({ where: { id_kegiatan: id } });
    removeFile(existing.gambar_kegiatan);

    res.json({ message: "Kegiatan berhasil dihapus" });
  } catch (error) {
    console.error("deleteKegiatan error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Dropdown / daftar komisi
const getKomisi = async (req, res) => {
  try {
    const data = await prisma.komisi.findMany({ orderBy: { id_komisi: "asc" } });
    res.json(data);
  } catch (error) {
    console.error("getKomisi error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const createKomisi = async (req, res) => {
  try {
    const { nama_komisi } = req.body;
    if (!nama_komisi || !nama_komisi.trim()) {
      return res.status(400).json({ message: "Nama komisi harus diisi" });
    }
    const data = await prisma.komisi.create({
      data: {
        id_user: req.user.id_user,
        nama_komisi: nama_komisi.trim(),
      },
    });
    res.status(201).json({ message: "Komisi berhasil dibuat", data });
  } catch (error) {
    console.error("createKomisi error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateKomisi = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nama_komisi } = req.body;
    if (!nama_komisi || !nama_komisi.trim()) {
      return res.status(400).json({ message: "Nama komisi harus diisi" });
    }
    const existing = await prisma.komisi.findUnique({ where: { id_komisi: id } });
    if (!existing)
      return res.status(404).json({ message: "Komisi tidak ditemukan" });

    const data = await prisma.komisi.update({
      where: { id_komisi: id },
      data: { nama_komisi: nama_komisi.trim() },
    });
    res.json({ message: "Komisi berhasil diperbarui", data });
  } catch (error) {
    console.error("updateKomisi error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteKomisi = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.komisi.findUnique({ where: { id_komisi: id } });
    if (!existing)
      return res.status(404).json({ message: "Komisi tidak ditemukan" });

    const terpakai = await prisma.kegiatan.count({ where: { id_komisi: id } });
    if (terpakai > 0) {
      return res.status(409).json({
        message: `Komisi tidak dapat dihapus karena masih dipakai ${terpakai} kegiatan`,
      });
    }

    await prisma.komisi.delete({ where: { id_komisi: id } });
    res.json({ message: "Komisi berhasil dihapus" });
  } catch (error) {
    console.error("deleteKomisi error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getKegiatan,
  createKegiatan,
  updateKegiatan,
  deleteKegiatan,
  getKomisi,
  createKomisi,
  updateKomisi,
  deleteKomisi,
};

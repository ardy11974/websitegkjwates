const path = require("path");
const fs = require("fs");
const prisma = require("../config/prisma");
const { uploadDir } = require("../middleware/upload.middleware");

// Hapus file lama (best-effort)
const removeFile = (filePath) => {
  if (!filePath) return;
  try {
    const full = path.join(uploadDir, path.basename(filePath));
    if (fs.existsSync(full)) fs.unlinkSync(full);
  } catch (e) {
    console.error("Gagal menghapus file:", e.message);
  }
};

const getPersyaratan = async (req, res) => {
  try {
    const data = await prisma.persyaratan.findMany({
      orderBy: { id_persyaratan: "asc" },
    });
    res.json(data);
  } catch (error) {
    console.error("getPersyaratan error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const createPersyaratan = async (req, res) => {
  try {
    const { kategori_persyaratan } = req.body;

    if (!kategori_persyaratan) {
      if (req.file) removeFile(req.file.filename);
      return res.status(400).json({ message: "Kategori harus diisi" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "File PDF harus diunggah" });
    }

    const data = await prisma.persyaratan.create({
      data: {
        id_user: req.user.id_user,
        kategori_persyaratan,
        file_pdf: `/uploads/${req.file.filename}`,
      },
    });

    res.status(201).json({ message: "Persyaratan berhasil dibuat", data });
  } catch (error) {
    console.error("createPersyaratan error:", error);
    if (req.file) removeFile(req.file.filename);
    res.status(500).json({ message: "Server Error" });
  }
};

const updatePersyaratan = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { kategori_persyaratan } = req.body;

    const existing = await prisma.persyaratan.findUnique({
      where: { id_persyaratan: id },
    });
    if (!existing) {
      if (req.file) removeFile(req.file.filename);
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    const filePdf = req.file
      ? `/uploads/${req.file.filename}`
      : existing.file_pdf;

    const data = await prisma.persyaratan.update({
      where: { id_persyaratan: id },
      data: {
        kategori_persyaratan:
          kategori_persyaratan ?? existing.kategori_persyaratan,
        file_pdf: filePdf,
      },
    });

    if (req.file && existing.file_pdf) removeFile(existing.file_pdf);

    res.json({ message: "Persyaratan berhasil diperbarui", data });
  } catch (error) {
    console.error("updatePersyaratan error:", error);
    if (req.file) removeFile(req.file.filename);
    res.status(500).json({ message: "Server Error" });
  }
};

const deletePersyaratan = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.persyaratan.findUnique({
      where: { id_persyaratan: id },
    });
    if (!existing)
      return res.status(404).json({ message: "Data tidak ditemukan" });

    await prisma.persyaratan.delete({ where: { id_persyaratan: id } });
    removeFile(existing.file_pdf);

    res.json({ message: "Persyaratan berhasil dihapus" });
  } catch (error) {
    console.error("deletePersyaratan error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getPersyaratan,
  createPersyaratan,
  updatePersyaratan,
  deletePersyaratan,
};

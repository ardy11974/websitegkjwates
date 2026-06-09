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

const getSorotan = async (req, res) => {
  try {
    const data = await prisma.sorotan.findMany({
      orderBy: { id_sorotan: "desc" },
    });
    res.json(data);
  } catch (error) {
    console.error("getSorotan error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const createSorotan = async (req, res) => {
  try {
    const { judul_sorotan, status_publish_sorotan } = req.body;

    if (!judul_sorotan) {
      if (req.file) removeFile(req.file.filename);
      return res.status(400).json({ message: "Judul sorotan harus diisi" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Gambar sorotan harus diunggah" });
    }

    const data = await prisma.sorotan.create({
      data: {
        id_user: req.user.id_user,
        judul_sorotan,
        gambar_sorotan: `/uploads/${req.file.filename}`,
        status_publish_sorotan:
          status_publish_sorotan === "PUBLISH" ? "PUBLISH" : "DRAFT",
      },
    });
    res.status(201).json({ message: "Sorotan berhasil dibuat", data });
  } catch (error) {
    console.error("createSorotan error:", error);
    if (req.file) removeFile(req.file.filename);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateSorotan = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { judul_sorotan, status_publish_sorotan } = req.body;

    const existing = await prisma.sorotan.findUnique({
      where: { id_sorotan: id },
    });
    if (!existing) {
      if (req.file) removeFile(req.file.filename);
      return res.status(404).json({ message: "Sorotan tidak ditemukan" });
    }

    const gambar = req.file
      ? `/uploads/${req.file.filename}`
      : existing.gambar_sorotan;

    const data = await prisma.sorotan.update({
      where: { id_sorotan: id },
      data: {
        judul_sorotan: judul_sorotan ?? existing.judul_sorotan,
        gambar_sorotan: gambar,
        status_publish_sorotan: status_publish_sorotan
          ? status_publish_sorotan === "PUBLISH"
            ? "PUBLISH"
            : "DRAFT"
          : existing.status_publish_sorotan,
      },
    });

    if (req.file && existing.gambar_sorotan) removeFile(existing.gambar_sorotan);

    res.json({ message: "Sorotan berhasil diperbarui", data });
  } catch (error) {
    console.error("updateSorotan error:", error);
    if (req.file) removeFile(req.file.filename);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteSorotan = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.sorotan.findUnique({
      where: { id_sorotan: id },
    });
    if (!existing)
      return res.status(404).json({ message: "Sorotan tidak ditemukan" });

    await prisma.sorotan.delete({ where: { id_sorotan: id } });
    removeFile(existing.gambar_sorotan);

    res.json({ message: "Sorotan berhasil dihapus" });
  } catch (error) {
    console.error("deleteSorotan error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getSorotan,
  createSorotan,
  updateSorotan,
  deleteSorotan,
};

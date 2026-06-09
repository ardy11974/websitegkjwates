const path = require("path");
const fs = require("fs");
const prisma = require("../config/prisma");
const { uploadDir } = require("../middleware/upload.middleware");

// Hapus file foto lama (best-effort, tidak menggagalkan request)
const removeFile = (fotoPath) => {
  if (!fotoPath) return;
  try {
    const filePath = path.join(uploadDir, path.basename(fotoPath));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (e) {
    console.error("Gagal menghapus file:", e.message);
  }
};

const getKemajelisan = async (req, res) => {
  try {
    const data = await prisma.kemajelisan.findMany({
      orderBy: { urutan_kemajelisan: "asc" },
    });
    res.json(data);
  } catch (error) {
    console.error("getKemajelisan error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getKemajelisanById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = await prisma.kemajelisan.findUnique({
      where: { id_kemajelisan: id },
    });
    if (!data) return res.status(404).json({ message: "Data tidak ditemukan" });
    res.json(data);
  } catch (error) {
    console.error("getKemajelisanById error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const createKemajelisan = async (req, res) => {
  try {
    const {
      nama_kemajelisan,
      jabatan_kemajelisan,
      periode_kemajelisan,
      urutan_kemajelisan,
    } = req.body;

    if (!nama_kemajelisan || !jabatan_kemajelisan || !periode_kemajelisan) {
      if (req.file) removeFile(req.file.filename);
      return res.status(400).json({
        message: "Nama, jabatan, dan periode harus diisi",
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Foto harus diunggah" });
    }

    const data = await prisma.kemajelisan.create({
      data: {
        id_user: req.user.id_user,
        nama_kemajelisan,
        jabatan_kemajelisan,
        periode_kemajelisan,
        foto_kemajelisan: `/uploads/${req.file.filename}`,
        urutan_kemajelisan: Number(urutan_kemajelisan) || 0,
      },
    });

    res.status(201).json({ message: "Kemajelisan berhasil dibuat", data });
  } catch (error) {
    console.error("createKemajelisan error:", error);
    if (req.file) removeFile(req.file.filename);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateKemajelisan = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const {
      nama_kemajelisan,
      jabatan_kemajelisan,
      periode_kemajelisan,
      urutan_kemajelisan,
    } = req.body;

    const existing = await prisma.kemajelisan.findUnique({
      where: { id_kemajelisan: id },
    });
    if (!existing) {
      if (req.file) removeFile(req.file.filename);
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    // Jika ada file baru -> pakai itu, hapus file lama. Jika tidak -> pertahankan.
    const fotoPath = req.file
      ? `/uploads/${req.file.filename}`
      : existing.foto_kemajelisan;

    const data = await prisma.kemajelisan.update({
      where: { id_kemajelisan: id },
      data: {
        nama_kemajelisan: nama_kemajelisan ?? existing.nama_kemajelisan,
        jabatan_kemajelisan:
          jabatan_kemajelisan ?? existing.jabatan_kemajelisan,
        periode_kemajelisan:
          periode_kemajelisan ?? existing.periode_kemajelisan,
        foto_kemajelisan: fotoPath,
        urutan_kemajelisan:
          urutan_kemajelisan !== undefined
            ? Number(urutan_kemajelisan) || 0
            : existing.urutan_kemajelisan,
      },
    });

    if (req.file && existing.foto_kemajelisan) {
      removeFile(existing.foto_kemajelisan);
    }

    res.json({ message: "Kemajelisan berhasil diperbarui", data });
  } catch (error) {
    console.error("updateKemajelisan error:", error);
    if (req.file) removeFile(req.file.filename);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteKemajelisan = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.kemajelisan.findUnique({
      where: { id_kemajelisan: id },
    });
    if (!existing)
      return res.status(404).json({ message: "Data tidak ditemukan" });

    await prisma.kemajelisan.delete({ where: { id_kemajelisan: id } });
    removeFile(existing.foto_kemajelisan);

    res.json({ message: "Kemajelisan berhasil dihapus" });
  } catch (error) {
    console.error("deleteKemajelisan error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getKemajelisan,
  getKemajelisanById,
  createKemajelisan,
  updateKemajelisan,
  deleteKemajelisan,
};

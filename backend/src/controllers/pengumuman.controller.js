const prisma = require("../config/prisma");

// ===== PENGUMUMAN (wadah) =====
const getPengumuman = async (req, res) => {
  try {
    const data = await prisma.pengumuman.findMany({
      include: {
        konten_pengumuman: { orderBy: { id_kontenPengumuman: "asc" } },
      },
      orderBy: { tanggal_publish: "desc" },
    });
    res.json(data);
  } catch (error) {
    console.error("getPengumuman error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getPengumumanById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = await prisma.pengumuman.findUnique({
      where: { id_pengumuman: id },
      include: {
        konten_pengumuman: { orderBy: { id_kontenPengumuman: "asc" } },
      },
    });
    if (!data) return res.status(404).json({ message: "Pengumuman tidak ditemukan" });
    res.json(data);
  } catch (error) {
    console.error("getPengumumanById error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Buat wadah kosong dulu (tanggal + status)
const createPengumuman = async (req, res) => {
  try {
    const { tanggal, status } = req.body;
    const data = await prisma.pengumuman.create({
      data: {
        id_user: req.user.id_user,
        tanggal_publish: tanggal ? new Date(tanggal) : new Date(),
        status_pengumuman: status === "PUBLISH" ? "PUBLISH" : "DRAFT",
      },
      include: { konten_pengumuman: true },
    });
    res.status(201).json({ message: "Pengumuman berhasil dibuat", data });
  } catch (error) {
    console.error("createPengumuman error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updatePengumuman = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { tanggal, status } = req.body;

    const existing = await prisma.pengumuman.findUnique({
      where: { id_pengumuman: id },
    });
    if (!existing) return res.status(404).json({ message: "Pengumuman tidak ditemukan" });

    const data = await prisma.pengumuman.update({
      where: { id_pengumuman: id },
      data: {
        tanggal_publish: tanggal ? new Date(tanggal) : existing.tanggal_publish,
        status_pengumuman: status
          ? status === "PUBLISH"
            ? "PUBLISH"
            : "DRAFT"
          : existing.status_pengumuman,
      },
    });
    res.json({ message: "Pengumuman berhasil diperbarui", data });
  } catch (error) {
    console.error("updatePengumuman error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const deletePengumuman = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.pengumuman.findUnique({
      where: { id_pengumuman: id },
    });
    if (!existing) return res.status(404).json({ message: "Pengumuman tidak ditemukan" });

    await prisma.kontenPengumuman.deleteMany({ where: { id_pengumuman: id } });
    await prisma.pengumuman.delete({ where: { id_pengumuman: id } });
    res.json({ message: "Pengumuman berhasil dihapus" });
  } catch (error) {
    console.error("deletePengumuman error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ===== KONTEN PENGUMUMAN (di dalam wadah) =====
const createKonten = async (req, res) => {
  try {
    const { id_pengumuman, judul, isi, tanggal } = req.body;
    if (!id_pengumuman || !judul || !isi) {
      return res.status(400).json({ message: "Judul dan isi harus diisi" });
    }
    const data = await prisma.kontenPengumuman.create({
      data: {
        id_pengumuman: Number(id_pengumuman),
        id_user: req.user.id_user,
        judul_pengumuman: judul,
        isi_pengumuman: isi,
        tanggal_pembuatan: tanggal ? new Date(tanggal) : new Date(),
      },
    });
    res.status(201).json({ message: "Konten pengumuman dibuat", data });
  } catch (error) {
    console.error("createKonten error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateKonten = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { judul, isi, tanggal } = req.body;

    const existing = await prisma.kontenPengumuman.findUnique({
      where: { id_kontenPengumuman: id },
    });
    if (!existing) return res.status(404).json({ message: "Konten tidak ditemukan" });

    const data = await prisma.kontenPengumuman.update({
      where: { id_kontenPengumuman: id },
      data: {
        judul_pengumuman: judul ?? existing.judul_pengumuman,
        isi_pengumuman: isi ?? existing.isi_pengumuman,
        tanggal_pembuatan: tanggal ? new Date(tanggal) : existing.tanggal_pembuatan,
      },
    });
    res.json({ message: "Konten pengumuman diperbarui", data });
  } catch (error) {
    console.error("updateKonten error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteKonten = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.kontenPengumuman.delete({ where: { id_kontenPengumuman: id } });
    res.json({ message: "Konten pengumuman dihapus" });
  } catch (error) {
    console.error("deleteKonten error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getPengumuman,
  getPengumumanById,
  createPengumuman,
  updatePengumuman,
  deletePengumuman,
  createKonten,
  updateKonten,
  deleteKonten,
};

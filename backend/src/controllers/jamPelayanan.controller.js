const prisma = require("../config/prisma");

// ===== IBADAH (wadah / nama ibadah) =====
const getIbadah = async (req, res) => {
  try {
    const data = await prisma.ibadah.findMany({
      orderBy: { id_ibadah: "asc" },
      include: { _count: { select: { jadwalIbadah: true } } },
    });
    res.json(data);
  } catch (error) {
    console.error("getIbadah error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Detail satu ibadah beserta jadwal di dalamnya
const getIbadahById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = await prisma.ibadah.findUnique({
      where: { id_ibadah: id },
      include: { jadwalIbadah: { orderBy: { id_jadwalIbadah: "asc" } } },
    });
    if (!data) return res.status(404).json({ message: "Ibadah tidak ditemukan" });
    res.json(data);
  } catch (error) {
    console.error("getIbadahById error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const createIbadah = async (req, res) => {
  try {
    const { nama_ibadah, status_publish_ibadah } = req.body;
    if (!nama_ibadah) {
      return res.status(400).json({ message: "Nama ibadah harus diisi" });
    }
    const data = await prisma.ibadah.create({
      data: {
        nama_ibadah,
        status_publish_ibadah: status_publish_ibadah === "PUBLISH" ? "PUBLISH" : "DRAFT",
        id_user: req.user.id_user,
      },
    });
    res.status(201).json({ message: "Ibadah berhasil dibuat", data });
  } catch (error) {
    console.error("createIbadah error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateIbadah = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nama_ibadah, status_publish_ibadah } = req.body;

    const existing = await prisma.ibadah.findUnique({ where: { id_ibadah: id } });
    if (!existing) return res.status(404).json({ message: "Ibadah tidak ditemukan" });

    const data = await prisma.ibadah.update({
      where: { id_ibadah: id },
      data: {
        nama_ibadah: nama_ibadah ?? existing.nama_ibadah,
        status_publish_ibadah: status_publish_ibadah
          ? status_publish_ibadah === "PUBLISH"
            ? "PUBLISH"
            : "DRAFT"
          : existing.status_publish_ibadah,
      },
    });
    res.json({ message: "Ibadah berhasil diperbarui", data });
  } catch (error) {
    console.error("updateIbadah error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteIbadah = async (req, res) => {
  try {
    const id = Number(req.params.id);
    // Hapus jadwal di dalamnya dulu, baru ibadahnya
    await prisma.jadwalIbadah.deleteMany({ where: { id_ibadah: id } });
    await prisma.ibadah.delete({ where: { id_ibadah: id } });
    res.json({ message: "Ibadah beserta jadwalnya berhasil dihapus" });
  } catch (error) {
    console.error("deleteIbadah error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ===== JADWAL IBADAH (di dalam sebuah ibadah) =====
const createJadwal = async (req, res) => {
  try {
    const { nama_jadwal, jam_ibadah, pelayan, id_ibadah } = req.body;
    if (!nama_jadwal || !jam_ibadah || !pelayan || !id_ibadah) {
      return res.status(400).json({
        message: "Nama jadwal, jam, pelayan, dan ibadah harus diisi",
      });
    }
    const data = await prisma.jadwalIbadah.create({
      data: {
        nama_jadwal,
        jam_ibadah,
        pelayan,
        id_ibadah: Number(id_ibadah),
        id_user: req.user.id_user,
      },
    });
    res.status(201).json({ message: "Jadwal ibadah dibuat", data });
  } catch (error) {
    console.error("createJadwal error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateJadwal = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nama_jadwal, jam_ibadah, pelayan } = req.body;

    const existing = await prisma.jadwalIbadah.findUnique({
      where: { id_jadwalIbadah: id },
    });
    if (!existing) return res.status(404).json({ message: "Jadwal tidak ditemukan" });

    const data = await prisma.jadwalIbadah.update({
      where: { id_jadwalIbadah: id },
      data: {
        nama_jadwal: nama_jadwal ?? existing.nama_jadwal,
        jam_ibadah: jam_ibadah ?? existing.jam_ibadah,
        pelayan: pelayan ?? existing.pelayan,
      },
    });
    res.json({ message: "Jadwal ibadah diperbarui", data });
  } catch (error) {
    console.error("updateJadwal error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteJadwal = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.jadwalIbadah.delete({ where: { id_jadwalIbadah: id } });
    res.json({ message: "Jadwal ibadah dihapus" });
  } catch (error) {
    console.error("deleteJadwal error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getIbadah,
  getIbadahById,
  createIbadah,
  updateIbadah,
  deleteIbadah,
  createJadwal,
  updateJadwal,
  deleteJadwal,
};

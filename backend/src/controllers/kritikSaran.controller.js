const prisma = require("../config/prisma");

const getKritikSaran = async (req, res) => {
  try {
    const data = await prisma.kritikSaran.findMany({
      orderBy: { created_at: "desc" },
    });
    res.json(data);
  } catch (error) {
    console.error("getKritikSaran error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Tandai pesan sudah dibaca
const markAsRead = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.kritikSaran.findUnique({
      where: { id_kritik: id },
    });
    if (!existing)
      return res.status(404).json({ message: "Pesan tidak ditemukan" });

    const data = await prisma.kritikSaran.update({
      where: { id_kritik: id },
      data: { status_kritikSaran: "DIBACA" },
    });
    res.json({ message: "Pesan ditandai sudah dibaca", data });
  } catch (error) {
    console.error("markAsRead error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteKritikSaran = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.kritikSaran.findUnique({
      where: { id_kritik: id },
    });
    if (!existing)
      return res.status(404).json({ message: "Pesan tidak ditemukan" });

    await prisma.kritikSaran.delete({ where: { id_kritik: id } });
    res.json({ message: "Pesan berhasil dihapus" });
  } catch (error) {
    console.error("deleteKritikSaran error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getKritikSaran, markAsRead, deleteKritikSaran };

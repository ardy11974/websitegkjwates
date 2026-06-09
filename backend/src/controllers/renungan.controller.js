const prisma = require("../config/prisma");

// Renungan yang dikelola = milik user yang sedang login (komisi masing-masing)
const getRenungan = async (req, res) => {
  try {
    const data = await prisma.renungan.findMany({
      where: { id_user: req.user.id_user },
      orderBy: { id_renungan: "desc" },
    });
    res.json(data);
  } catch (error) {
    console.error("getRenungan error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const createRenungan = async (req, res) => {
  try {
    const {
      judul_renungan,
      bacaan_renungan,
      nats_renungan,
      isi_renungan,
      penulis_renungan,
      tanggal_renungan,
      status_renungan,
    } = req.body;

    if (!judul_renungan || !bacaan_renungan || !nats_renungan || !isi_renungan || !penulis_renungan) {
      return res.status(400).json({
        message: "Judul, bacaan, nats, isi, dan penulis harus diisi",
      });
    }

    const data = await prisma.renungan.create({
      data: {
        id_user: req.user.id_user,
        judul_renungan,
        bacaan_renungan,
        nats_renungan,
        isi_renungan,
        penulis_renungan,
        tanggal_renungan: tanggal_renungan ? new Date(tanggal_renungan) : new Date(),
        status_renungan: status_renungan === "PUBLISH" ? "PUBLISH" : "DRAFT",
      },
    });
    res.status(201).json({ message: "Renungan berhasil dibuat", data });
  } catch (error) {
    console.error("createRenungan error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateRenungan = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.renungan.findUnique({ where: { id_renungan: id } });
    if (!existing) return res.status(404).json({ message: "Renungan tidak ditemukan" });

    const {
      judul_renungan,
      bacaan_renungan,
      nats_renungan,
      isi_renungan,
      penulis_renungan,
      tanggal_renungan,
      status_renungan,
    } = req.body;

    const data = await prisma.renungan.update({
      where: { id_renungan: id },
      data: {
        judul_renungan: judul_renungan ?? existing.judul_renungan,
        bacaan_renungan: bacaan_renungan ?? existing.bacaan_renungan,
        nats_renungan: nats_renungan ?? existing.nats_renungan,
        isi_renungan: isi_renungan ?? existing.isi_renungan,
        penulis_renungan: penulis_renungan ?? existing.penulis_renungan,
        tanggal_renungan: tanggal_renungan
          ? new Date(tanggal_renungan)
          : existing.tanggal_renungan,
        status_renungan: status_renungan
          ? status_renungan === "PUBLISH"
            ? "PUBLISH"
            : "DRAFT"
          : existing.status_renungan,
      },
    });
    res.json({ message: "Renungan berhasil diperbarui", data });
  } catch (error) {
    console.error("updateRenungan error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteRenungan = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.renungan.findUnique({ where: { id_renungan: id } });
    if (!existing) return res.status(404).json({ message: "Renungan tidak ditemukan" });

    await prisma.renungan.delete({ where: { id_renungan: id } });
    res.json({ message: "Renungan berhasil dihapus" });
  } catch (error) {
    console.error("deleteRenungan error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getRenungan,
  createRenungan,
  updateRenungan,
  deleteRenungan,
};

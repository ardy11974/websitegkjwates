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

// Ambil pengaturan web (tabel singleton - hanya 1 baris). Bisa null jika belum ada.
const getPengaturan = async (req, res) => {
  try {
    const data = await prisma.pengaturanWeb.findFirst();
    res.json(data);
  } catch (error) {
    console.error("getPengaturan error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Simpan pengaturan web (partial): hanya field yang dikirim yang diperbarui,
// field lain tetap memakai nilai lama. Tidak ada field yang wajib.
const TEXT_FIELDS = ["visi", "misi", "sejarah", "motto", "alamat", "email"];
const OPTIONAL_FIELDS = ["instagram", "youtube", "whatsapp", "copyright_text"];

const upsertPengaturan = async (req, res) => {
  try {
    const existing = await prisma.pengaturanWeb.findFirst();

    // Kumpulkan hanya field yang benar-benar dikirim
    const provided = {};
    for (const f of [...TEXT_FIELDS, ...OPTIONAL_FIELDS]) {
      if (req.body[f] !== undefined) {
        const val = req.body[f];
        // Field opsional yang dikosongkan -> null
        provided[f] = OPTIONAL_FIELDS.includes(f) && val === "" ? null : val;
      }
    }
    if (req.file) provided.gambar_landing = `/uploads/${req.file.filename}`;

    let data;
    if (existing) {
      // Update sebagian: field yang tidak dikirim dibiarkan apa adanya
      data = await prisma.pengaturanWeb.update({
        where: { id_pengaturan: existing.id_pengaturan },
        data: provided,
      });
      if (req.file && existing.gambar_landing) removeFile(existing.gambar_landing);
    } else {
      // Belum ada baris -> buat baru; field teks wajib default "" agar tidak melanggar NOT NULL
      const createData = {
        visi: provided.visi ?? "",
        misi: provided.misi ?? "",
        sejarah: provided.sejarah ?? "",
        motto: provided.motto ?? "",
        alamat: provided.alamat ?? "",
        email: provided.email ?? "",
        instagram: provided.instagram ?? null,
        youtube: provided.youtube ?? null,
        whatsapp: provided.whatsapp ?? null,
        copyright_text: provided.copyright_text ?? null,
        gambar_landing: provided.gambar_landing ?? null,
      };
      data = await prisma.pengaturanWeb.create({ data: createData });
    }

    res.json({ message: "Pengaturan web berhasil disimpan", data });
  } catch (error) {
    console.error("upsertPengaturan error:", error);
    if (req.file) removeFile(req.file.filename);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getPengaturan, upsertPengaturan };

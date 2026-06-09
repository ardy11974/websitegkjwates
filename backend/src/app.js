require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Akses publik ke file gambar yang diupload (backend/uploads -> /uploads/...)
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const roleRoutes = require("./routes/role.routes");
const kritikSaranRoutes = require("./routes/kritikSaran.routes");
const kemajelisanRoutes = require("./routes/kemajelisan.routes");
const pengaturanRoutes = require("./routes/pengaturanWeb.routes");
const persyaratanRoutes = require("./routes/persyaratan.routes");
const jamPelayananRoutes = require("./routes/jamPelayanan.routes");
const sorotanRoutes = require("./routes/sorotan.routes");
const pengumumanRoutes = require("./routes/pengumuman.routes");
const kegiatanRoutes = require("./routes/kegiatan.routes");
const beritaRoutes = require("./routes/berita.routes");
const renunganRoutes = require("./routes/renungan.routes");
const publicRoutes = require("./routes/public.routes");

app.get("/", (req, res) => {
  res.send("Backend GKJ Wates jalan");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/kritik-saran", kritikSaranRoutes);
app.use("/api/kemajelisan", kemajelisanRoutes);
app.use("/api/pengaturan", pengaturanRoutes);
app.use("/api/persyaratan", persyaratanRoutes);
app.use("/api/jam-pelayanan", jamPelayananRoutes);
app.use("/api/sorotan", sorotanRoutes);
app.use("/api/pengumuman", pengumumanRoutes);
app.use("/api/kegiatan", kegiatanRoutes);
app.use("/api/berita", beritaRoutes);
app.use("/api/renungan", renunganRoutes);
app.use("/api/public", publicRoutes);

// Error handler (mis. error upload dari multer) -> balas JSON
app.use((err, req, res, next) => {
  if (err) {
    return res.status(400).json({ message: err.message || "Terjadi kesalahan" });
  }
  next();
});

module.exports = app;

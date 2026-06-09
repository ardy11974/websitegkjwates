const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

const JWT_SECRET = process.env.JWT_SECRET || "gkj-wates-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

// Nama tampilan ramah per role untuk header dashboard
const DISPLAY_NAME = {
  admin: "Administrasi",
  kompa: "Admin KOMPA",
  komnak: "Admin KOMNAK",
  multimedia: "Multimedia",
  pendeta: "Pendeta",
};

const buildSafeUser = (user) => {
  const role = user.role?.nama_role || null;
  return {
    id_user: user.id_user,
    username: user.username,
    email: user.email,
    role,
    displayName: DISPLAY_NAME[role] || user.username,
  };
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username dan password harus diisi",
      });
    }

    // Login bisa pakai username atau email
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email: username }],
      },
      include: { role: true },
    });

    if (!user) {
      return res.status(401).json({
        message: "Username atau password salah",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Username atau password salah",
      });
    }

    const safeUser = buildSafeUser(user);

    const token = jwt.sign(
      { id_user: safeUser.id_user, role: safeUser.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.json({
      message: "Login berhasil",
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Reset password mandiri: user mengidentifikasi diri lewat username ATAU email,
// lalu menetapkan password baru. (Tanpa kirim email karena belum ada SMTP.)
const forgotPassword = async (req, res) => {
  try {
    const { identifier, newPassword } = req.body;

    if (!identifier || !newPassword) {
      return res.status(400).json({
        message: "Username/email dan password baru harus diisi",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password baru minimal 6 karakter",
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: identifier }, { email: identifier }],
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "Akun dengan username/email tersebut tidak ditemukan",
      });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id_user: user.id_user },
      data: { password: hashed },
    });

    return res.json({
      message: "Password berhasil diubah. Silakan login kembali.",
    });
  } catch (error) {
    console.error("forgotPassword error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Mengembalikan data user yang sedang login (berdasarkan token)
const me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id_user: req.user.id_user },
      include: { role: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    return res.json({ user: buildSafeUser(user) });
  } catch (error) {
    console.error("Me error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { login, forgotPassword, me };

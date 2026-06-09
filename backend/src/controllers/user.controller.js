const bcrypt = require("bcryptjs");
const prisma = require("../config/prisma");

// Bentuk data user yang aman dikirim ke frontend (tanpa password)
const selectSafe = {
  id_user: true,
  username: true,
  email: true,
  id_role: true,
  created_at: true,
  role: { select: { id_role: true, nama_role: true } },
};

const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: selectSafe,
      orderBy: { id_user: "asc" },
    });
    res.json(users);
  } catch (error) {
    console.error("getUsers error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id_user: id },
      select: selectSafe,
    });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
    res.json(user);
  } catch (error) {
    console.error("getUserById error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, password, id_role, email } = req.body;

    if (!username || !password || !id_role || !email) {
      return res
        .status(400)
        .json({ message: "Username, email, password, dan role harus diisi" });
    }

    // Cek duplikat username / email
    const exists = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });
    if (exists) {
      return res
        .status(409)
        .json({ message: "Username atau email sudah digunakan" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashed,
        id_role: Number(id_role),
      },
      select: selectSafe,
    });

    res.status(201).json({ message: "User berhasil dibuat", user });
  } catch (error) {
    console.error("createUser error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { username, password, id_role, email } = req.body;

    const existing = await prisma.user.findUnique({ where: { id_user: id } });
    if (!existing)
      return res.status(404).json({ message: "User tidak ditemukan" });

    const data = {};
    if (username && username !== existing.username) {
      const dup = await prisma.user.findFirst({
        where: { username, NOT: { id_user: id } },
      });
      if (dup)
        return res.status(409).json({ message: "Username sudah digunakan" });
      data.username = username;
    }
    if (email && email !== existing.email) {
      const dupEmail = await prisma.user.findFirst({
        where: { email, NOT: { id_user: id } },
      });
      if (dupEmail)
        return res.status(409).json({ message: "Email sudah digunakan" });
      data.email = email;
    }
    if (id_role) data.id_role = Number(id_role);
    if (password) data.password = await bcrypt.hash(password, 10);

    const user = await prisma.user.update({
      where: { id_user: id },
      data,
      select: selectSafe,
    });

    res.json({ message: "User berhasil diperbarui", user });
  } catch (error) {
    console.error("updateUser error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (req.user?.id_user === id) {
      return res
        .status(400)
        .json({ message: "Tidak dapat menghapus akun yang sedang login" });
    }

    const existing = await prisma.user.findUnique({ where: { id_user: id } });
    if (!existing)
      return res.status(404).json({ message: "User tidak ditemukan" });

    await prisma.user.delete({ where: { id_user: id } });
    res.json({ message: "User berhasil dihapus" });
  } catch (error) {
    console.error("deleteUser error:", error);
    // Gagal hapus biasanya karena masih punya relasi (berita, dll)
    if (error.code === "P2003") {
      return res.status(409).json({
        message: "User masih memiliki data terkait dan tidak dapat dihapus",
      });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};

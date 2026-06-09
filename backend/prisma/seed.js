const bcrypt = require("bcryptjs");
const prisma = require("../src/config/prisma");

// Daftar role yang dibutuhkan aplikasi
const ROLES = [
  { nama_role: "admin", deskripsi_role: "Administrator sistem GKJ Wates" },
  { nama_role: "kompa", deskripsi_role: "Komisi Pemuda & Anak (KOMPA)" },
  { nama_role: "komnak", deskripsi_role: "Komisi Anak (KOMNAK)" },
  { nama_role: "multimedia", deskripsi_role: "Divisi Multimedia GKJ Wates" },
  { nama_role: "pendeta", deskripsi_role: "Pendeta GKJ Wates" },
];

// User awal yang dibuat saat seeding
const USERS = [
  {
    username: "admin",
    email: "admin@gkjwates.org",
    password: "admin123",
    role: "admin",
  },
  {
    username: "pendeta",
    email: "pendeta@gkjwates.org",
    password: "pendeta123",
    role: "pendeta",
  },
];

async function main() {
  console.log("Seeding roles...");
  const roleMap = {};
  for (const role of ROLES) {
    let existing = await prisma.roles.findFirst({
      where: { nama_role: role.nama_role },
    });
    if (!existing) {
      existing = await prisma.roles.create({ data: role });
      console.log(`  + role dibuat: ${role.nama_role}`);
    } else {
      console.log(`  = role sudah ada: ${role.nama_role}`);
    }
    roleMap[role.nama_role] = existing.id_role;
  }

  console.log("Seeding users...");
  for (const u of USERS) {
    const existing = await prisma.user.findUnique({
      where: { username: u.username },
    });
    if (existing) {
      console.log(`  = user sudah ada: ${u.username}`);
      continue;
    }
    const hashed = await bcrypt.hash(u.password, 10);
    await prisma.user.create({
      data: {
        username: u.username,
        email: u.email,
        password: hashed,
        id_role: roleMap[u.role],
      },
    });
    console.log(`  + user dibuat: ${u.username} (role: ${u.role})`);
  }

  // Pemilik default data master (komisi & kategori): user admin
  const admin = await prisma.user.findUnique({ where: { username: "admin" } });
  const ownerId = admin ? admin.id_user : 1;

  console.log("Seeding komisi...");
  for (const nama of ["Multimedia", "Komisi Pemuda", "Komisi Anak"]) {
    const ada = await prisma.komisi.findFirst({ where: { nama_komisi: nama } });
    if (ada) {
      console.log(`  = komisi sudah ada: ${nama}`);
    } else {
      await prisma.komisi.create({ data: { nama_komisi: nama, id_user: ownerId } });
      console.log(`  + komisi dibuat: ${nama}`);
    }
  }

  console.log("Seeding kategori berita...");
  for (const nama of ["Pernikahan", "Event"]) {
    const ada = await prisma.kategori.findFirst({
      where: { nama_kategori: nama },
    });
    if (ada) {
      console.log(`  = kategori sudah ada: ${nama}`);
    } else {
      await prisma.kategori.create({
        data: { nama_kategori: nama, id_user: ownerId },
      });
      console.log(`  + kategori dibuat: ${nama}`);
    }
  }

  console.log("Seeding selesai.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

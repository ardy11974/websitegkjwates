/*
  Warnings:

  - You are about to alter the column `status_berita` on the `berita` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to drop the column `deskripsi_ibadah` on the `ibadah` table. All the data in the column will be lost.
  - You are about to drop the column `hari` on the `jadwalibadah` table. All the data in the column will be lost.
  - You are about to drop the column `jam` on the `jadwalibadah` table. All the data in the column will be lost.
  - You are about to drop the column `lokasi` on the `jadwalibadah` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `kegiatan` table. All the data in the column will be lost.
  - You are about to drop the column `foto` on the `kemajelisan` table. All the data in the column will be lost.
  - You are about to drop the column `jabatan` on the `kemajelisan` table. All the data in the column will be lost.
  - You are about to drop the column `nama_majelis` on the `kemajelisan` table. All the data in the column will be lost.
  - You are about to alter the column `status_pengumuman` on the `pengumuman` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.
  - You are about to drop the column `isi_persyaratan` on the `persyaratan` table. All the data in the column will be lost.
  - You are about to drop the column `nama_persyaratan` on the `persyaratan` table. All the data in the column will be lost.
  - Added the required column `jam_ibadah` to the `JadwalIbadah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama_jadwal` to the `JadwalIbadah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pelayan` to the `JadwalIbadah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Kategori` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status_kegiatan` to the `Kegiatan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jabatan_kemajelisan` to the `Kemajelisan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama_kemajelisan` to the `Kemajelisan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `periode_kemajelisan` to the `Kemajelisan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `urutan_kemajelisan` to the `Kemajelisan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Komisi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file_pdf` to the `Persyaratan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kategori_persyaratan` to the `Persyaratan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bacaan_renungan` to the `Renungan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nats_renungan` to the `Renungan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `penulis_renungan` to the `Renungan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status_renungan` to the `Renungan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `berita` MODIFY `status_berita` ENUM('DRAFT', 'PUBLISH') NOT NULL;

-- AlterTable
ALTER TABLE `ibadah` DROP COLUMN `deskripsi_ibadah`;

-- AlterTable
ALTER TABLE `jadwalibadah` DROP COLUMN `hari`,
    DROP COLUMN `jam`,
    DROP COLUMN `lokasi`,
    ADD COLUMN `jam_ibadah` VARCHAR(191) NOT NULL,
    ADD COLUMN `nama_jadwal` VARCHAR(191) NOT NULL,
    ADD COLUMN `pelayan` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `kategori` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `kegiatan` DROP COLUMN `status`,
    ADD COLUMN `status_kegiatan` ENUM('DRAFT', 'PUBLISH', 'SELESAI') NOT NULL;

-- AlterTable
ALTER TABLE `kemajelisan` DROP COLUMN `foto`,
    DROP COLUMN `jabatan`,
    DROP COLUMN `nama_majelis`,
    ADD COLUMN `foto_kemajelisan` VARCHAR(191) NULL,
    ADD COLUMN `jabatan_kemajelisan` VARCHAR(191) NOT NULL,
    ADD COLUMN `nama_kemajelisan` VARCHAR(191) NOT NULL,
    ADD COLUMN `periode_kemajelisan` VARCHAR(191) NOT NULL,
    ADD COLUMN `urutan_kemajelisan` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `komisi` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `pengumuman` MODIFY `status_pengumuman` ENUM('DRAFT', 'PUBLISH') NOT NULL;

-- AlterTable
ALTER TABLE `persyaratan` DROP COLUMN `isi_persyaratan`,
    DROP COLUMN `nama_persyaratan`,
    ADD COLUMN `file_pdf` VARCHAR(191) NOT NULL,
    ADD COLUMN `kategori_persyaratan` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `renungan` ADD COLUMN `bacaan_renungan` VARCHAR(191) NOT NULL,
    ADD COLUMN `nats_renungan` VARCHAR(191) NOT NULL,
    ADD COLUMN `penulis_renungan` VARCHAR(191) NOT NULL,
    ADD COLUMN `status_renungan` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `KritikSaran` (
    `id_kritik` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_pengirim` VARCHAR(191) NULL,
    `email_pengirim` VARCHAR(191) NULL,
    `isi_pesan` TEXT NOT NULL,
    `status_kritikSaran` ENUM('BELUM_DIBACA', 'DIBACA') NOT NULL DEFAULT 'BELUM_DIBACA',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_kritik`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PengaturanWeb` (
    `id_pengaturan` INTEGER NOT NULL AUTO_INCREMENT,
    `visi` TEXT NOT NULL,
    `misi` TEXT NOT NULL,
    `sejarah` TEXT NOT NULL,
    `motto` TEXT NOT NULL,
    `alamat` TEXT NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `instagram` VARCHAR(191) NULL,
    `youtube` VARCHAR(191) NULL,
    `whatsapp` VARCHAR(191) NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_pengaturan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Komisi` (
    `id_komisi` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` INTEGER NOT NULL,
    `nama_komisi` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_komisi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kegiatan` (
    `id_kegiatan` INTEGER NOT NULL AUTO_INCREMENT,
    `id_komisi` INTEGER NOT NULL,
    `id_user` INTEGER NOT NULL,
    `judul_kegiatan` VARCHAR(191) NOT NULL,
    `gambar_kegiatan` VARCHAR(191) NULL,
    `deskripsi_kegiatan` TEXT NOT NULL,
    `tanggal_kegiatan` DATETIME(3) NOT NULL,
    `lokasi_kegiatan` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_kegiatan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Komisi` ADD CONSTRAINT `Komisi_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Kegiatan` ADD CONSTRAINT `Kegiatan_id_komisi_fkey` FOREIGN KEY (`id_komisi`) REFERENCES `Komisi`(`id_komisi`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Kegiatan` ADD CONSTRAINT `Kegiatan_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

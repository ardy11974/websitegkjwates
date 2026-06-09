-- CreateTable
CREATE TABLE `Pengumuman` (
    `id_pengumuman` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` INTEGER NOT NULL,
    `tanggal_publish` DATETIME(3) NOT NULL,
    `status_pengumuman` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_pengumuman`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KontenPengumuman` (
    `id_kontenPengumuman` INTEGER NOT NULL AUTO_INCREMENT,
    `id_pengumuman` INTEGER NOT NULL,
    `id_user` INTEGER NOT NULL,
    `judul_pengumuman` VARCHAR(191) NOT NULL,
    `isi_pengumuman` TEXT NOT NULL,
    `tanggal_pembuatan` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_kontenPengumuman`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sorotan` (
    `id_sorotan` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` INTEGER NOT NULL,
    `judul_sorotan` VARCHAR(191) NOT NULL,
    `gambar_sorotan` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_sorotan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pengumuman` ADD CONSTRAINT `Pengumuman_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KontenPengumuman` ADD CONSTRAINT `KontenPengumuman_id_pengumuman_fkey` FOREIGN KEY (`id_pengumuman`) REFERENCES `Pengumuman`(`id_pengumuman`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KontenPengumuman` ADD CONSTRAINT `KontenPengumuman_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sorotan` ADD CONSTRAINT `Sorotan_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

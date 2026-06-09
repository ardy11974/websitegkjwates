-- CreateTable
CREATE TABLE `Ibadah` (
    `id_ibadah` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` INTEGER NOT NULL,
    `nama_ibadah` VARCHAR(191) NOT NULL,
    `deskripsi_ibadah` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_ibadah`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JadwalIbadah` (
    `id_jadwalIbadah` INTEGER NOT NULL AUTO_INCREMENT,
    `id_ibadah` INTEGER NOT NULL,
    `id_user` INTEGER NOT NULL,
    `hari` VARCHAR(191) NOT NULL,
    `jam` VARCHAR(191) NOT NULL,
    `lokasi` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_jadwalIbadah`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Ibadah` ADD CONSTRAINT `Ibadah_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JadwalIbadah` ADD CONSTRAINT `JadwalIbadah_id_ibadah_fkey` FOREIGN KEY (`id_ibadah`) REFERENCES `Ibadah`(`id_ibadah`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JadwalIbadah` ADD CONSTRAINT `JadwalIbadah_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

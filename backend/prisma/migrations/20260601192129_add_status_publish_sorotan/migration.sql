-- AlterTable
ALTER TABLE `sorotan` ADD COLUMN `status_publish_sorotan` ENUM('DRAFT', 'PUBLISH') NOT NULL DEFAULT 'DRAFT';

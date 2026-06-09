-- AlterTable
ALTER TABLE `ibadah` ADD COLUMN `status_publish_ibadah` ENUM('DRAFT', 'PUBLISH') NOT NULL DEFAULT 'DRAFT';

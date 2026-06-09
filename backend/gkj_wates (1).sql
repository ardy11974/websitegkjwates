-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 09, 2026 at 04:58 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gkj_wates`
--

-- --------------------------------------------------------

--
-- Table structure for table `berita`
--

CREATE TABLE `berita` (
  `id_berita` int(11) NOT NULL,
  `id_kategori` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `judul_berita` varchar(191) NOT NULL,
  `isi_berita` text NOT NULL,
  `gambar_berita` varchar(191) DEFAULT NULL,
  `tanggal_berita` datetime(3) NOT NULL,
  `penulis_berita` varchar(191) NOT NULL,
  `status_berita` enum('DRAFT','PUBLISH') NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `berita`
--

INSERT INTO `berita` (`id_berita`, `id_kategori`, `id_user`, `judul_berita`, `isi_berita`, `gambar_berita`, `tanggal_berita`, `penulis_berita`, `status_berita`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Pernikahan Warga', 'Berita pernikahan lengkap', NULL, '2026-06-01 19:28:04.715', 'Multimedia', 'PUBLISH', '2026-06-01 19:28:04.716', '2026-06-01 19:28:04.716'),
(2, 2, 9, 'Lomba Badminton Antar Wilayah', 'YAHAHAHAAHAHAHAHAAHAHAHA', '/uploads/foto-1780402152305-913847657.png', '2026-05-31 00:00:00.000', 'Gerald Situmorang', 'PUBLISH', '2026-06-02 12:09:12.319', '2026-06-04 20:51:31.530');

-- --------------------------------------------------------

--
-- Table structure for table `ibadah`
--

CREATE TABLE `ibadah` (
  `id_ibadah` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `nama_ibadah` varchar(191) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `status_publish_ibadah` enum('DRAFT','PUBLISH') NOT NULL DEFAULT 'DRAFT'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ibadah`
--

INSERT INTO `ibadah` (`id_ibadah`, `id_user`, `nama_ibadah`, `created_at`, `updated_at`, `status_publish_ibadah`) VALUES
(1, 1, 'Ibadah Minggu', '2026-06-01 19:28:04.264', '2026-06-01 20:50:50.282', 'PUBLISH'),
(2, 9, 'Ibadah Pentakosta', '2026-06-01 19:50:22.812', '2026-06-01 20:55:42.135', 'DRAFT'),
(3, 9, 'Ibadah Natal', '2026-06-01 20:52:16.965', '2026-06-01 20:52:16.965', 'DRAFT');

-- --------------------------------------------------------

--
-- Table structure for table `jadwalibadah`
--

CREATE TABLE `jadwalibadah` (
  `id_jadwalIbadah` int(11) NOT NULL,
  `id_ibadah` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `jam_ibadah` varchar(191) NOT NULL,
  `nama_jadwal` varchar(191) NOT NULL,
  `pelayan` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `jadwalibadah`
--

INSERT INTO `jadwalibadah` (`id_jadwalIbadah`, `id_ibadah`, `id_user`, `created_at`, `updated_at`, `jam_ibadah`, `nama_jadwal`, `pelayan`) VALUES
(1, 1, 1, '2026-06-01 19:28:04.400', '2026-06-01 19:28:04.400', '07.00', 'Ibadah Pagi', 'Pdt. Andreas'),
(2, 2, 9, '2026-06-01 19:50:46.218', '2026-06-01 19:50:46.218', '08.00', 'Perayaan Pentakosta 2026', 'Pdt. Martnius Dwi Anggara'),
(3, 1, 9, '2026-06-01 20:47:13.708', '2026-06-01 20:47:13.708', '09.00', 'Ibadah Siang', 'Pdt. Andhika Tri Subowo'),
(4, 1, 9, '2026-06-01 20:51:34.522', '2026-06-01 20:51:34.522', '16.00', 'Ibadah Sore', 'Sdr. Jati Narwastu'),
(5, 1, 9, '2026-06-01 20:51:50.116', '2026-06-01 20:51:50.116', '18.30', 'Ibadah Malam', 'Sdri. Nisya');

-- --------------------------------------------------------

--
-- Table structure for table `kategori`
--

CREATE TABLE `kategori` (
  `id_kategori` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `nama_kategori` varchar(191) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `kategori`
--

INSERT INTO `kategori` (`id_kategori`, `id_user`, `nama_kategori`, `created_at`, `updated_at`) VALUES
(1, 1, 'Pernikahan', '2026-06-01 19:22:29.982', '2026-06-01 19:22:29.982'),
(2, 1, 'Event', '2026-06-01 19:22:29.987', '2026-06-01 19:22:29.987');

-- --------------------------------------------------------

--
-- Table structure for table `kegiatan`
--

CREATE TABLE `kegiatan` (
  `id_kegiatan` int(11) NOT NULL,
  `id_komisi` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `judul_kegiatan` varchar(191) NOT NULL,
  `gambar_kegiatan` varchar(191) DEFAULT NULL,
  `deskripsi_kegiatan` text NOT NULL,
  `tanggal_kegiatan` datetime(3) NOT NULL,
  `lokasi_kegiatan` varchar(191) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `status_kegiatan` enum('DRAFT','PUBLISH','SELESAI') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `kegiatan`
--

INSERT INTO `kegiatan` (`id_kegiatan`, `id_komisi`, `id_user`, `judul_kegiatan`, `gambar_kegiatan`, `deskripsi_kegiatan`, `tanggal_kegiatan`, `lokasi_kegiatan`, `created_at`, `updated_at`, `status_kegiatan`) VALUES
(1, 1, 1, 'Pelatihan Live Streaming', NULL, 'Belajar live', '2026-06-15 00:00:00.000', 'Gedung A', '2026-06-01 19:28:04.583', '2026-06-02 21:53:13.530', 'SELESAI');

-- --------------------------------------------------------

--
-- Table structure for table `kemajelisan`
--

CREATE TABLE `kemajelisan` (
  `id_kemajelisan` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `foto_kemajelisan` varchar(191) DEFAULT NULL,
  `jabatan_kemajelisan` varchar(191) NOT NULL,
  `nama_kemajelisan` varchar(191) NOT NULL,
  `periode_kemajelisan` varchar(191) NOT NULL,
  `urutan_kemajelisan` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `kemajelisan`
--

INSERT INTO `kemajelisan` (`id_kemajelisan`, `id_user`, `created_at`, `updated_at`, `foto_kemajelisan`, `jabatan_kemajelisan`, `nama_kemajelisan`, `periode_kemajelisan`, `urutan_kemajelisan`) VALUES
(4, 1, '2026-06-04 07:12:57.666', '2026-06-04 07:12:57.666', '/uploads/foto-1780557177664-757687438.jpg', 'Ketua', 'Pak Itu', '2026-2030', 1),
(5, 1, '2026-06-04 13:33:11.911', '2026-06-04 13:33:11.911', '/uploads/foto-1780579991904-304372701.jpg', 'Bendahara', 'Bu ini', '2026-2030', 2),
(6, 1, '2026-06-04 13:33:34.489', '2026-06-04 13:33:34.489', '/uploads/foto-1780580014485-808883830.jpg', 'Sekretaris', 'Pak Ogah', '2026-2030', 2),
(7, 1, '2026-06-04 13:34:11.702', '2026-06-04 13:34:11.702', '/uploads/foto-1780580051699-639402167.jpg', 'Komisi A', 'Pak Keren', '2026-2030', 3),
(8, 1, '2026-06-04 13:34:34.020', '2026-06-04 13:34:34.020', '/uploads/foto-1780580074017-79657372.jpg', 'Komisi B', 'Pak Biasa Aja', '2026-2030', 3),
(9, 1, '2026-06-04 13:34:55.414', '2026-06-04 13:34:55.414', '/uploads/foto-1780580095411-52413431.jpg', 'Komisi C', 'Pak Jago', '2026-2030', 3);

-- --------------------------------------------------------

--
-- Table structure for table `komisi`
--

CREATE TABLE `komisi` (
  `id_komisi` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `nama_komisi` varchar(191) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `komisi`
--

INSERT INTO `komisi` (`id_komisi`, `id_user`, `nama_komisi`, `created_at`, `updated_at`) VALUES
(1, 1, 'Multimedia', '2026-06-01 19:22:29.976', '2026-06-01 19:22:29.976'),
(2, 1, 'Komisi Pemuda', '2026-06-02 14:07:34.295', '2026-06-02 14:07:34.295'),
(3, 1, 'Komisi Anak', '2026-06-02 14:07:34.299', '2026-06-02 14:07:34.299');

-- --------------------------------------------------------

--
-- Table structure for table `kontenpengumuman`
--

CREATE TABLE `kontenpengumuman` (
  `id_kontenPengumuman` int(11) NOT NULL,
  `id_pengumuman` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `judul_pengumuman` varchar(191) NOT NULL,
  `isi_pengumuman` text NOT NULL,
  `tanggal_pembuatan` datetime(3) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `kontenpengumuman`
--

INSERT INTO `kontenpengumuman` (`id_kontenPengumuman`, `id_pengumuman`, `id_user`, `judul_pengumuman`, `isi_pengumuman`, `tanggal_pembuatan`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Rapat Pleno Majelis', 'Diadakan rapat pleno', '2026-06-10 00:00:00.000', '2026-06-01 19:28:04.442', '2026-06-01 20:03:02.794'),
(2, 2, 1, 'Pendaftaran Katekisasi', 'Dibuka pendaftaran', '2026-06-20 00:00:00.000', '2026-06-01 20:37:46.980', '2026-06-01 20:37:46.980'),
(7, 2, 9, 'Jemaat Baru', 'Selamat datang untuk sdri awikwok', '2026-06-20 00:00:00.000', '2026-06-01 20:58:55.754', '2026-06-01 21:00:39.454');

-- --------------------------------------------------------

--
-- Table structure for table `kritiksaran`
--

CREATE TABLE `kritiksaran` (
  `id_kritik` int(11) NOT NULL,
  `nama_pengirim` varchar(191) DEFAULT NULL,
  `email_pengirim` varchar(191) DEFAULT NULL,
  `isi_pesan` text NOT NULL,
  `status_kritikSaran` enum('BELUM_DIBACA','DIBACA') NOT NULL DEFAULT 'BELUM_DIBACA',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `kritiksaran`
--

INSERT INTO `kritiksaran` (`id_kritik`, `nama_pengirim`, `email_pengirim`, `isi_pesan`, `status_kritikSaran`, `created_at`) VALUES
(1, 'Budi', 'budi@mail.com', 'Ibadahnya bagus, terima kasih!', 'DIBACA', '2026-06-04 20:13:57.013'),
(2, NULL, NULL, 'BAGUS BANGET INI GEREJA JIRRR', 'DIBACA', '2026-06-04 20:17:16.875');

-- --------------------------------------------------------

--
-- Table structure for table `pengaturanweb`
--

CREATE TABLE `pengaturanweb` (
  `id_pengaturan` int(11) NOT NULL,
  `visi` text NOT NULL,
  `misi` text NOT NULL,
  `sejarah` text NOT NULL,
  `motto` text NOT NULL,
  `alamat` text NOT NULL,
  `email` varchar(191) NOT NULL,
  `instagram` varchar(191) DEFAULT NULL,
  `youtube` varchar(191) DEFAULT NULL,
  `whatsapp` varchar(191) DEFAULT NULL,
  `updated_at` datetime(3) NOT NULL,
  `copyright_text` varchar(191) DEFAULT NULL,
  `gambar_landing` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pengaturanweb`
--

INSERT INTO `pengaturanweb` (`id_pengaturan`, `visi`, `misi`, `sejarah`, `motto`, `alamat`, `email`, `instagram`, `youtube`, `whatsapp`, `updated_at`, `copyright_text`, `gambar_landing`) VALUES
(4, 'Hai', '1. Lorem\r\n2. Ipsum\r\n3. Lorem Ipsum\r\n4. Asik', 'Kenalan', 'Ga?', '', '', 'https://www.instagram.com/gkjwates.official/', 'https://www.youtube.com/@GKJWates', 'wa.me/6281575606664', '2026-06-05 10:05:51.659', NULL, '/uploads/foto-1780557127445-264536879.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `pengumuman`
--

CREATE TABLE `pengumuman` (
  `id_pengumuman` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `tanggal_publish` datetime(3) NOT NULL,
  `status_pengumuman` enum('DRAFT','PUBLISH') NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pengumuman`
--

INSERT INTO `pengumuman` (`id_pengumuman`, `id_user`, `tanggal_publish`, `status_pengumuman`, `created_at`, `updated_at`) VALUES
(1, 1, '2026-06-10 00:00:00.000', 'PUBLISH', '2026-06-01 19:28:04.442', '2026-06-02 13:00:40.579'),
(2, 1, '2026-06-20 00:00:00.000', 'PUBLISH', '2026-06-01 20:37:46.900', '2026-06-01 20:37:46.900');

-- --------------------------------------------------------

--
-- Table structure for table `persyaratan`
--

CREATE TABLE `persyaratan` (
  `id_persyaratan` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `file_pdf` varchar(191) NOT NULL,
  `kategori_persyaratan` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `persyaratan`
--

INSERT INTO `persyaratan` (`id_persyaratan`, `id_user`, `created_at`, `updated_at`, `file_pdf`, `kategori_persyaratan`) VALUES
(3, 1, '2026-06-05 05:36:26.787', '2026-06-05 05:36:26.787', '/uploads/doc-1780637786783-708117993.pdf', 'Pernikahan'),
(4, 1, '2026-06-05 05:42:07.473', '2026-06-05 05:42:07.473', '/uploads/doc-1780638127456-751178694.pdf', 'Baptis'),
(5, 1, '2026-06-05 05:42:17.651', '2026-06-05 05:42:17.651', '/uploads/doc-1780638137630-120500950.pdf', 'Katekisasi'),
(6, 1, '2026-06-05 05:42:42.613', '2026-06-05 05:42:42.613', '/uploads/doc-1780638162594-632574737.pdf', 'Jemaat Baru');

-- --------------------------------------------------------

--
-- Table structure for table `renungan`
--

CREATE TABLE `renungan` (
  `id_renungan` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `judul_renungan` varchar(191) NOT NULL,
  `isi_renungan` text NOT NULL,
  `tanggal_renungan` datetime(3) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `bacaan_renungan` varchar(191) NOT NULL,
  `nats_renungan` varchar(191) NOT NULL,
  `penulis_renungan` varchar(191) NOT NULL,
  `status_renungan` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `renungan`
--

INSERT INTO `renungan` (`id_renungan`, `id_user`, `judul_renungan`, `isi_renungan`, `tanggal_renungan`, `created_at`, `updated_at`, `bacaan_renungan`, `nats_renungan`, `penulis_renungan`, `status_renungan`) VALUES
(1, 7, 'Pemuda Bertumbuh', 'Isi pemuda', '2026-06-02 14:08:16.935', '2026-06-02 14:08:16.948', '2026-06-02 14:08:16.948', 'Mazmur 1', 'Berbahagialah...', 'KOMPA', 'PUBLISH'),
(2, 8, 'Anak Ceria', 'Isi anak', '2026-06-02 14:08:16.951', '2026-06-02 14:08:16.953', '2026-06-02 14:08:16.953', 'Matius 19', 'Biarkan anak-anak...', 'KOMNAK', 'PUBLISH'),
(4, 8, 'Aku Senang', 'Isi nya', '2026-06-03 00:00:00.000', '2026-06-02 21:39:41.838', '2026-06-02 21:39:41.838', 'Kisah Para Rasul', 'Janganlah', 'Kak Yunus', 'PUBLISH'),
(5, 10, 'Damai Sejahtera', 'Isi renungan pendeta.', '2026-06-02 22:41:19.755', '2026-06-02 22:41:19.757', '2026-06-02 22:41:19.757', 'Yohanes 14', 'Damai sejahtera Kutinggalkan bagimu', 'Pdt. GKJ Wates', 'PUBLISH');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id_role` int(11) NOT NULL,
  `nama_role` varchar(191) NOT NULL,
  `deskripsi_role` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id_role`, `nama_role`, `deskripsi_role`) VALUES
(1, 'admin', 'Administrator sistem GKJ Wates'),
(2, 'kompa', 'Komisi Pemuda & Anak (KOMPA)'),
(3, 'komnak', 'Komisi Anak (KOMNAK)'),
(4, 'multimedia', 'Divisi Multimedia GKJ Wates'),
(5, 'pendeta', 'Pendeta GKJ Wates');

-- --------------------------------------------------------

--
-- Table structure for table `sorotan`
--

CREATE TABLE `sorotan` (
  `id_sorotan` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `judul_sorotan` varchar(191) NOT NULL,
  `gambar_sorotan` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `status_publish_sorotan` enum('DRAFT','PUBLISH') NOT NULL DEFAULT 'DRAFT'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sorotan`
--

INSERT INTO `sorotan` (`id_sorotan`, `id_user`, `judul_sorotan`, `gambar_sorotan`, `created_at`, `updated_at`, `status_publish_sorotan`) VALUES
(6, 9, 'Natal yey', '/uploads/foto-1780405411271-40590362.jpg', '2026-06-02 13:03:31.277', '2026-06-02 13:03:51.611', 'PUBLISH'),
(7, 9, 'Baksos yey', '/uploads/foto-1780405424005-450375837.jpg', '2026-06-02 13:03:44.009', '2026-06-02 13:03:46.395', 'PUBLISH'),
(8, 9, 'Hahay', '/uploads/foto-1780639131344-832825472.png', '2026-06-05 05:58:51.353', '2026-06-05 05:58:51.353', 'PUBLISH'),
(9, 9, 'Cihuy', '/uploads/foto-1780639144062-739769076.png', '2026-06-05 05:59:04.073', '2026-06-05 05:59:04.073', 'PUBLISH'),
(10, 9, 'Jett', '/uploads/foto-1780639160965-558454263.png', '2026-06-05 05:59:20.981', '2026-06-05 05:59:20.981', 'PUBLISH'),
(11, 9, 'Chamber', '/uploads/foto-1780639178797-151814113.png', '2026-06-05 05:59:38.804', '2026-06-05 05:59:38.804', 'PUBLISH');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `email` varchar(191) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `id_role` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `password` varchar(191) NOT NULL,
  `updated_at` datetime(3) NOT NULL,
  `username` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`email`, `created_at`, `id_role`, `id_user`, `password`, `updated_at`, `username`) VALUES
('admin@gkjwates.org', '2026-06-01 15:01:31.654', 1, 1, '$2b$10$Q2w.IFjNbzoEjspYGRKL4eEBiD0B4DKycX8.8aKth9GAj2iuL2BEq', '2026-06-01 15:01:31.654', 'admin'),
('kompaasik@gmail.com', '2026-06-01 16:33:19.467', 2, 7, '$2b$10$4kqNebZCStV9YEDdt3w1ButDkZZNprpz.RfUNNQC3vhrUHnaQ6rfq', '2026-06-01 16:33:19.467', 'kompaasik'),
('komnakasik@gmail.com', '2026-06-01 16:33:53.041', 3, 8, '$2b$10$sZ7PiVoG1c0RkYF10gQg/.nSS2e/GPVq2SJ067hGof824gdP9l1aq', '2026-06-02 13:43:11.968', 'komnakasik'),
('multimediaasik@gmail.com', '2026-06-01 18:39:01.626', 4, 9, '$2b$10$gbV0/XTNqx82NDpeL8EcyOZvYND27eHsAJuShgcvoQqqaf0RSb55.', '2026-06-01 19:46:27.888', 'multimediaasik'),
('pendeta@gkjwates.org', '2026-06-02 22:38:38.218', 5, 10, '$2b$10$PRU.u9BWKQd8pe18FAgaK.VzuldqjZtIUl5UF1c/PEJ97vTMxB4nK', '2026-06-02 22:38:38.218', 'pendeta');

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('015f4dd3-afe8-4034-be8a-e5c85aa1ba5b', 'f8c03d9c6e1db598037a36e3e61a8c55b33e9d890181e12a0062eb7082bb7e1b', '2026-05-29 22:54:02.020', '20260529213342_create_user_role', NULL, NULL, '2026-05-29 22:54:01.958', 1),
('1c93b799-53c6-49b5-bc02-6e9df8286bbc', 'c9b01be1eb54b3404d0116049ffd88a4facf3e40724af7de068d6c423debee8f', '2026-06-01 19:21:29.055', '20260601192129_add_status_publish_sorotan', NULL, NULL, '2026-06-01 19:21:29.047', 1),
('2b7f4cfe-6e33-4b67-afd7-7fec0ebae10b', '7b4c05746042dc7064e210b271e14491b4d0b018b80abf0e2b0a0d1ae965897c', '2026-05-29 22:54:02.090', '20260529220343_init_schema', NULL, NULL, '2026-05-29 22:54:02.020', 1),
('5898488a-4d6c-46e7-b43c-813f8374d9f2', '295dcb8474cc6333b342617398f0b200caa28bac02a9c27300898ac905cdd2e4', '2026-05-29 22:54:02.261', '20260529221635_create_pengumuman_sorotan', NULL, NULL, '2026-05-29 22:54:02.157', 1),
('740c307a-78bd-4e9d-9e65-9b5b6d71c75a', '1034ac8b12116327ff3eafc99cf3f9799cda16ea3deb76fd14daec6a0c7ac352', '2026-05-29 22:54:02.395', '20260529223503_create_ibadah_jadwal', NULL, NULL, '2026-05-29 22:54:02.330', 1),
('8765cf76-1e76-4f60-b337-d776545fe828', 'fa96cc82b12fb4fa2ad5a697c461763bd9276c16be96f96e62d324fff5da4642', '2026-06-04 06:48:30.820', '20260604064830_add_pengaturan_landing_copyright', NULL, NULL, '2026-06-04 06:48:30.814', 1),
('8fc82f22-0c42-4b33-9bf8-104d61526048', '9187c47936958fabd93f04d3c01577a6ba4d69779451a1b194bac9144a3395b9', '2026-05-29 22:54:01.957', '20260529205134_init', NULL, NULL, '2026-05-29 22:54:01.937', 1),
('9581b78b-b27f-43f6-a7da-07c2f421cbeb', 'cc54edde207130465e3ea192030bd35227ee3e3f3013b013462cd2ff7e436755', '2026-05-29 22:54:02.329', '20260529222241_create_renungan_persyaratan_kemajelisan', NULL, NULL, '2026-05-29 22:54:02.261', 1),
('a28de140-83e7-40a7-9b8d-c8a55fa901ef', '67a3d03d470e001176761d02b9f7713af14ffa1bd879f917763dfd544ebe4bb2', '2026-06-01 20:34:38.712', '20260601203438_add_status_publish_ibadah', NULL, NULL, '2026-06-01 20:34:38.706', 1),
('cda77336-85f9-4de6-a9d4-24c3ab7015f0', '990446d007266dd0ffb7609e544ead5cb261f1109390492f3702f087f55dd5e8', '2026-05-29 22:54:02.156', '20260529220821_create_komisi_kegiatan', NULL, NULL, '2026-05-29 22:54:02.091', 1),
('f3d3b7bf-800e-4801-9b01-bd7754d25497', 'cce4951c6a3eb3ef6054f2f92ce082fe94a7dfe94c89fb5972c4300ae29a8e4a', '2026-05-30 15:24:48.745', '20260530152448_init_final_schema', NULL, NULL, '2026-05-30 15:24:48.676', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `berita`
--
ALTER TABLE `berita`
  ADD PRIMARY KEY (`id_berita`),
  ADD KEY `Berita_id_kategori_fkey` (`id_kategori`),
  ADD KEY `Berita_id_user_fkey` (`id_user`);

--
-- Indexes for table `ibadah`
--
ALTER TABLE `ibadah`
  ADD PRIMARY KEY (`id_ibadah`),
  ADD KEY `Ibadah_id_user_fkey` (`id_user`);

--
-- Indexes for table `jadwalibadah`
--
ALTER TABLE `jadwalibadah`
  ADD PRIMARY KEY (`id_jadwalIbadah`),
  ADD KEY `JadwalIbadah_id_ibadah_fkey` (`id_ibadah`),
  ADD KEY `JadwalIbadah_id_user_fkey` (`id_user`);

--
-- Indexes for table `kategori`
--
ALTER TABLE `kategori`
  ADD PRIMARY KEY (`id_kategori`),
  ADD KEY `Kategori_id_user_fkey` (`id_user`);

--
-- Indexes for table `kegiatan`
--
ALTER TABLE `kegiatan`
  ADD PRIMARY KEY (`id_kegiatan`),
  ADD KEY `Kegiatan_id_komisi_fkey` (`id_komisi`),
  ADD KEY `Kegiatan_id_user_fkey` (`id_user`);

--
-- Indexes for table `kemajelisan`
--
ALTER TABLE `kemajelisan`
  ADD PRIMARY KEY (`id_kemajelisan`),
  ADD KEY `Kemajelisan_id_user_fkey` (`id_user`);

--
-- Indexes for table `komisi`
--
ALTER TABLE `komisi`
  ADD PRIMARY KEY (`id_komisi`),
  ADD KEY `Komisi_id_user_fkey` (`id_user`);

--
-- Indexes for table `kontenpengumuman`
--
ALTER TABLE `kontenpengumuman`
  ADD PRIMARY KEY (`id_kontenPengumuman`),
  ADD KEY `KontenPengumuman_id_pengumuman_fkey` (`id_pengumuman`),
  ADD KEY `KontenPengumuman_id_user_fkey` (`id_user`);

--
-- Indexes for table `kritiksaran`
--
ALTER TABLE `kritiksaran`
  ADD PRIMARY KEY (`id_kritik`);

--
-- Indexes for table `pengaturanweb`
--
ALTER TABLE `pengaturanweb`
  ADD PRIMARY KEY (`id_pengaturan`);

--
-- Indexes for table `pengumuman`
--
ALTER TABLE `pengumuman`
  ADD PRIMARY KEY (`id_pengumuman`),
  ADD KEY `Pengumuman_id_user_fkey` (`id_user`);

--
-- Indexes for table `persyaratan`
--
ALTER TABLE `persyaratan`
  ADD PRIMARY KEY (`id_persyaratan`),
  ADD KEY `Persyaratan_id_user_fkey` (`id_user`);

--
-- Indexes for table `renungan`
--
ALTER TABLE `renungan`
  ADD PRIMARY KEY (`id_renungan`),
  ADD KEY `Renungan_id_user_fkey` (`id_user`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_role`);

--
-- Indexes for table `sorotan`
--
ALTER TABLE `sorotan`
  ADD PRIMARY KEY (`id_sorotan`),
  ADD KEY `Sorotan_id_user_fkey` (`id_user`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `User_email_key` (`email`),
  ADD UNIQUE KEY `User_username_key` (`username`),
  ADD KEY `User_id_role_fkey` (`id_role`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `berita`
--
ALTER TABLE `berita`
  MODIFY `id_berita` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `ibadah`
--
ALTER TABLE `ibadah`
  MODIFY `id_ibadah` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `jadwalibadah`
--
ALTER TABLE `jadwalibadah`
  MODIFY `id_jadwalIbadah` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `kategori`
--
ALTER TABLE `kategori`
  MODIFY `id_kategori` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `kegiatan`
--
ALTER TABLE `kegiatan`
  MODIFY `id_kegiatan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `kemajelisan`
--
ALTER TABLE `kemajelisan`
  MODIFY `id_kemajelisan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `komisi`
--
ALTER TABLE `komisi`
  MODIFY `id_komisi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `kontenpengumuman`
--
ALTER TABLE `kontenpengumuman`
  MODIFY `id_kontenPengumuman` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `kritiksaran`
--
ALTER TABLE `kritiksaran`
  MODIFY `id_kritik` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `pengaturanweb`
--
ALTER TABLE `pengaturanweb`
  MODIFY `id_pengaturan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `pengumuman`
--
ALTER TABLE `pengumuman`
  MODIFY `id_pengumuman` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `persyaratan`
--
ALTER TABLE `persyaratan`
  MODIFY `id_persyaratan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `renungan`
--
ALTER TABLE `renungan`
  MODIFY `id_renungan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id_role` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `sorotan`
--
ALTER TABLE `sorotan`
  MODIFY `id_sorotan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `berita`
--
ALTER TABLE `berita`
  ADD CONSTRAINT `Berita_id_kategori_fkey` FOREIGN KEY (`id_kategori`) REFERENCES `kategori` (`id_kategori`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Berita_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON UPDATE CASCADE;

--
-- Constraints for table `ibadah`
--
ALTER TABLE `ibadah`
  ADD CONSTRAINT `Ibadah_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON UPDATE CASCADE;

--
-- Constraints for table `jadwalibadah`
--
ALTER TABLE `jadwalibadah`
  ADD CONSTRAINT `JadwalIbadah_id_ibadah_fkey` FOREIGN KEY (`id_ibadah`) REFERENCES `ibadah` (`id_ibadah`) ON UPDATE CASCADE,
  ADD CONSTRAINT `JadwalIbadah_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON UPDATE CASCADE;

--
-- Constraints for table `kategori`
--
ALTER TABLE `kategori`
  ADD CONSTRAINT `Kategori_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON UPDATE CASCADE;

--
-- Constraints for table `kegiatan`
--
ALTER TABLE `kegiatan`
  ADD CONSTRAINT `Kegiatan_id_komisi_fkey` FOREIGN KEY (`id_komisi`) REFERENCES `komisi` (`id_komisi`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Kegiatan_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON UPDATE CASCADE;

--
-- Constraints for table `kemajelisan`
--
ALTER TABLE `kemajelisan`
  ADD CONSTRAINT `Kemajelisan_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON UPDATE CASCADE;

--
-- Constraints for table `komisi`
--
ALTER TABLE `komisi`
  ADD CONSTRAINT `Komisi_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON UPDATE CASCADE;

--
-- Constraints for table `kontenpengumuman`
--
ALTER TABLE `kontenpengumuman`
  ADD CONSTRAINT `KontenPengumuman_id_pengumuman_fkey` FOREIGN KEY (`id_pengumuman`) REFERENCES `pengumuman` (`id_pengumuman`) ON UPDATE CASCADE,
  ADD CONSTRAINT `KontenPengumuman_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON UPDATE CASCADE;

--
-- Constraints for table `pengumuman`
--
ALTER TABLE `pengumuman`
  ADD CONSTRAINT `Pengumuman_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON UPDATE CASCADE;

--
-- Constraints for table `persyaratan`
--
ALTER TABLE `persyaratan`
  ADD CONSTRAINT `Persyaratan_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON UPDATE CASCADE;

--
-- Constraints for table `renungan`
--
ALTER TABLE `renungan`
  ADD CONSTRAINT `Renungan_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON UPDATE CASCADE;

--
-- Constraints for table `sorotan`
--
ALTER TABLE `sorotan`
  ADD CONSTRAINT `Sorotan_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON UPDATE CASCADE;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `User_id_role_fkey` FOREIGN KEY (`id_role`) REFERENCES `roles` (`id_role`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

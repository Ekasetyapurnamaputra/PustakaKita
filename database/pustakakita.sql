-- ==============================================================
-- DATABASE DUMP: PustakaKita (Sistem Informasi Perpustakaan Digital)
-- Dibuat untuk: XAMPP / MySQL / MariaDB
-- Tanggal: 2026-10-20
-- ==============================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP DATABASE IF EXISTS `pustakakita_db`;
CREATE DATABASE IF NOT EXISTS `pustakakita_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `pustakakita_db`;

-- -------------------------------------------------------------
-- 1. Tabel Kategori Buku
-- -------------------------------------------------------------
DROP TABLE IF EXISTS `kategori`;
CREATE TABLE `kategori` (
  `id_kategori` INT(11) NOT NULL AUTO_INCREMENT,
  `nama_kategori` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL,
  `deskripsi` TEXT DEFAULT NULL,
  `icon` VARCHAR(50) DEFAULT 'fa-book',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_kategori`),
  UNIQUE KEY `slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `kategori` (`id_kategori`, `nama_kategori`, `slug`, `deskripsi`, `icon`) VALUES
(1, 'Teknologi & Komputer', 'teknologi-komputer', 'Buku pemrograman, web development, dan kecerdasan buatan', 'fa-laptop-code'),
(2, 'Sains & Matematika', 'sains-matematika', 'Buku fisika, kimia, biologi, dan matematika sekolah', 'fa-atom'),
(3, 'Sastra & Fiksi', 'sastra-fiksi', 'Novel, antologi puisi, cerpen karya sastrawan terkemuka', 'fa-feather-pointed'),
(4, 'Sejarah & Sosial', 'sejarah-sosial', 'Buku sejarah peradaban, sosiologi, dan geografi', 'fa-landmark'),
(5, 'Pengembangan Diri', 'pengembangan-diri', 'Buku motivasi, produktivitas, kepemimpinan, dan psikologi populer', 'fa-brain'),
(6, 'Referensi & Bahasa', 'referensi-bahasa', 'Kamus, ensiklopedia, panduan tata bahasa Indonesia & asing', 'fa-spell-check');

-- -------------------------------------------------------------
-- 2. Tabel Rak Penyimpanan Fisik Buku
-- -------------------------------------------------------------
DROP TABLE IF EXISTS `rak`;
CREATE TABLE `rak` (
  `id_rak` INT(11) NOT NULL AUTO_INCREMENT,
  `kode_rak` VARCHAR(20) NOT NULL,
  `nama_rak` VARCHAR(100) NOT NULL,
  `lokasi_gedung` VARCHAR(100) NOT NULL DEFAULT 'Gedung Perpustakaan Utama',
  `lantai` INT(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_rak`),
  UNIQUE KEY `kode_rak_unique` (`kode_rak`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `rak` (`id_rak`, `kode_rak`, `nama_rak`, `lokasi_gedung`, `lantai`) VALUES
(1, 'RAK-TK-01', 'Rak Teknologi & Pemrograman', 'Sayap Timur', 1),
(2, 'RAK-SM-02', 'Rak MIPA & Laboratorium', 'Sayap Barat', 1),
(3, 'RAK-SF-03', 'Rak Sastra & Novel Populer', 'Lantai 2 Tengah', 2),
(4, 'RAK-SS-04', 'Rak Sejarah & Geografi', 'Lantai 2 Sayap Barat', 2),
(5, 'RAK-PD-05', 'Rak Self Improvement & Karir', 'Sayap Timur', 1),
(6, 'RAK-RF-06', 'Rak Ensiklopedia & Referensi Guru', 'Ruang Referensi Khusus', 2);

-- -------------------------------------------------------------
-- 3. Tabel Pengguna (Siswa, Guru, Admin / Pustakawan)
-- -------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id_user` INT(11) NOT NULL AUTO_INCREMENT,
  `nis_nip` VARCHAR(30) NOT NULL,
  `nama_lengkap` VARCHAR(120) NOT NULL,
  `email` VARCHAR(120) NOT NULL,
  `password` VARCHAR(255) NOT NULL, -- Disimpan dalam hash bcrypt saat terhubung ke PHP
  `role` ENUM('siswa', 'guru', 'admin') NOT NULL DEFAULT 'siswa',
  `kelas_jurusan` VARCHAR(50) DEFAULT NULL, -- Khusus siswa / pengajar bidang studi
  `no_telepon` VARCHAR(20) DEFAULT NULL,
  `foto_profil` VARCHAR(255) DEFAULT 'default_avatar.png',
  `status_aktif` ENUM('aktif', 'nonaktif', 'suspend') NOT NULL DEFAULT 'aktif',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `nis_nip_unique` (`nis_nip`),
  UNIQUE KEY `email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id_user`, `nis_nip`, `nama_lengkap`, `email`, `password`, `role`, `kelas_jurusan`, `no_telepon`, `foto_profil`, `status_aktif`) VALUES
(1, 'ADM-2026-001', 'Dewi Sartika, S.I.Pust.', 'dewi.admin@pustakakita.sch.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Kepala Perpustakaan', '081234567801', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', 'aktif'),
(2, 'GUR-1985-007', 'Drs. Hendra Gunawan, M.Pd.', 'hendra.guru@pustakakita.sch.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'guru', 'Guru Bahasa & Sastra', '081234567802', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150', 'aktif'),
(3, 'SIS-2024-101', 'Budi Pratama', 'budi.siswa@pustakakita.sch.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'siswa', 'XII RPL 1', '081234567803', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'aktif'),
(4, 'SIS-2024-102', 'Siti Nurhaliza', 'siti.siswa@pustakakita.sch.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'siswa', 'XI IPA 2', '081234567804', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'aktif'),
(5, 'GUR-1990-012', 'Ratna Kusuma, S.Kom.', 'ratna.guru@pustakakita.sch.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'guru', 'Guru Informatika & Rekayasa Perangkat Lunak', '081234567805', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', 'aktif');

-- -------------------------------------------------------------
-- 4. Tabel Data Buku
-- -------------------------------------------------------------
DROP TABLE IF EXISTS `buku`;
CREATE TABLE `buku` (
  `id_buku` INT(11) NOT NULL AUTO_INCREMENT,
  `isbn` VARCHAR(25) NOT NULL,
  `judul` VARCHAR(255) NOT NULL,
  `pengarang` VARCHAR(150) NOT NULL,
  `penerbit` VARCHAR(150) NOT NULL,
  `tahun_terbit` YEAR NOT NULL,
  `id_kategori` INT(11) NOT NULL,
  `id_rak` INT(11) NOT NULL,
  `stok_total` INT(11) NOT NULL DEFAULT 1,
  `stok_tersedia` INT(11) NOT NULL DEFAULT 1,
  `deskripsi` TEXT DEFAULT NULL,
  `sampul_gambar` VARCHAR(255) DEFAULT NULL,
  `halaman` INT(11) DEFAULT 0,
  `bahasa` VARCHAR(50) DEFAULT 'Indonesia',
  `populer_count` INT(11) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_buku`),
  UNIQUE KEY `isbn_unique` (`isbn`),
  KEY `fk_buku_kategori` (`id_kategori`),
  KEY `fk_buku_rak` (`id_rak`),
  CONSTRAINT `fk_buku_kategori` FOREIGN KEY (`id_kategori`) REFERENCES `kategori` (`id_kategori`) ON UPDATE CASCADE,
  CONSTRAINT `fk_buku_rak` FOREIGN KEY (`id_rak`) REFERENCES `rak` (`id_rak`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `buku` (`id_buku`, `isbn`, `judul`, `pengarang`, `penerbit`, `tahun_terbit`, `id_kategori`, `id_rak`, `stok_total`, `stok_tersedia`, `deskripsi`, `sampul_gambar`, `halaman`, `bahasa`, `populer_count`) VALUES
(1, '978-602-06-3317-6', 'Pemrograman Web Modern dengan PHP & MySQL', 'Budi Raharjo', 'Informatika Bandung', 2023, 1, 1, 8, 5, 'Panduan komprehensif merancang aplikasi web modern dari dasar hingga mahir, mencakup OOP PHP, MySQLi, PDO, dan arsitektur MVC.', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', 420, 'Indonesia', 42),
(2, '978-979-3062-79-2', 'Laskar Pelangi', 'Andrea Hirata', 'Bentang Pustaka', 2019, 3, 3, 10, 2, 'Kisah inspiratif tentang perjuangan sepuluh anak di Belitung dalam menempuh pendidikan di sekolah Muhammadiyah yang serba terbatas.', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', 529, 'Indonesia', 98),
(3, '978-602-03-8591-4', 'Bumi Manusia (Tetralogi Buru #1)', 'Pramoedya Ananta Toer', 'Lentera Dipantara', 2021, 3, 3, 6, 1, 'Karya masterpiece sastra Indonesia yang memotret pergulatan batin Minke di era kolonial Hindia Belanda dan cinta tragisnya dengan Annelies.', 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400', 535, 'Indonesia', 76),
(4, '978-623-00-2441-2', 'Atomic Habits: Perubahan Kecil yang Memberikan Hasil Luar Biasa', 'James Clear', 'Gramedia Pustaka Utama', 2022, 5, 5, 5, 3, 'Sebuah metode praktis dan terbukti untuk membentuk kebiasaan baik, menghilangkan kebiasaan buruk, dan menguasai perilaku kecil yang menghasilkan lonjakan prestasi.', 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400', 356, 'Indonesia', 89),
(5, '978-602-444-123-8', 'Fisika Dasar untuk Sains & Teknik Edisi 7', 'David Halliday & Robert Resnick', 'Erlangga', 2020, 2, 2, 4, 4, 'Buku referensi wajib fisika mencakup mekanika klasik, gelombang, termodinamika, dan elektromagnetisme dengan latihan soal mendalam.', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400', 680, 'Indonesia', 28),
(6, '978-602-291-234-1', 'Sejarah Peradaban Islam', 'Dr. Badri Yatim, M.A.', 'Rajawali Pers', 2021, 4, 4, 5, 5, 'Melacak jejak sejarah perkembangan peradaban Islam sejak masa kenabian, khulafaur rasyidin, dinasti Umayyah, Abbasiyah, hingga penyebaran di Nusantara.', 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400', 388, 'Indonesia', 19),
(7, '978-602-06-4890-3', 'Kecerdasan Buatan & Machine Learning Praktis', 'Yuniar Supardi', 'Elex Media Komputindo', 2023, 1, 1, 6, 6, 'Mengenal konsep dasar Artificial Intelligence, Python data science, neural networks, dan implementasi computer vision secara praktis.', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400', 312, 'Indonesia', 34),
(8, '978-602-03-2478-4', 'Filosofi Teras: Stoisisme untuk Mental Tangguh', 'Henry Manampiring', 'Kompas Buku', 2022, 5, 5, 7, 0, 'Penerapan filsafat Yunani-Romawi Kuno Stoikisme untuk membantu generasi muda mengatasi rasa khawatir berlebihan dan emosi negatif.', 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400', 344, 'Indonesia', 110);

-- -------------------------------------------------------------
-- 5. Tabel Transaksi Peminjaman & Pemesanan (Booking)
-- -------------------------------------------------------------
DROP TABLE IF EXISTS `transaksi`;
CREATE TABLE `transaksi` (
  `id_transaksi` INT(11) NOT NULL AUTO_INCREMENT,
  `kode_transaksi` VARCHAR(30) NOT NULL,
  `id_user` INT(11) NOT NULL,
  `id_buku` INT(11) NOT NULL,
  `tgl_booking` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `tgl_pinjam` DATE DEFAULT NULL,
  `tenggat_kembali` DATE DEFAULT NULL,
  `tgl_kembali` DATE DEFAULT NULL,
  `status` ENUM('booking', 'dipinjam', 'dikembalikan', 'denda_lunas', 'batal') NOT NULL DEFAULT 'booking',
  `denda` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `catatan` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_transaksi`),
  UNIQUE KEY `kode_transaksi_unique` (`kode_transaksi`),
  KEY `fk_transaksi_user` (`id_user`),
  KEY `fk_transaksi_buku` (`id_buku`),
  CONSTRAINT `fk_transaksi_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON UPDATE CASCADE,
  CONSTRAINT `fk_transaksi_buku` FOREIGN KEY (`id_buku`) REFERENCES `buku` (`id_buku`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `transaksi` (`id_transaksi`, `kode_transaksi`, `id_user`, `id_buku`, `tgl_booking`, `tgl_pinjam`, `tenggat_kembali`, `tgl_kembali`, `status`, `denda`, `catatan`) VALUES
(1, 'TRX-202610-001', 3, 1, '2026-10-14 09:00:00', '2026-10-14', '2026-10-21', NULL, 'dipinjam', 0.00, 'Peminjaman rutin mata pelajaran RPL'),
(2, 'TRX-202610-002', 4, 2, '2026-10-10 11:20:00', '2026-10-10', '2026-10-17', NULL, 'dipinjam', 3000.00, 'Terlambat 3 hari (Tarif denda: Rp 1.000 / hari)'),
(3, 'TRX-202610-003', 2, 5, '2026-10-01 08:30:00', '2026-10-01', '2026-10-14', '2026-10-12', 'dikembalikan', 0.00, 'Dikembalikan tepat waktu dalam kondisi prima'),
(4, 'TRX-202610-004', 3, 4, '2026-10-20 07:45:00', NULL, NULL, NULL, 'booking', 0.00, 'Pemesanan online, batas ambil s/d 21 Okt 2026 pk 16:00'),
(5, 'TRX-202610-005', 4, 8, '2026-10-19 14:10:00', '2026-10-19', '2026-10-26', NULL, 'dipinjam', 0.00, 'Peminjaman mandiri di perpustakaan');

-- -------------------------------------------------------------
-- 6. Tabel Notifikasi Pengingat Pengguna
-- -------------------------------------------------------------
DROP TABLE IF EXISTS `notifikasi`;
CREATE TABLE `notifikasi` (
  `id_notif` INT(11) NOT NULL AUTO_INCREMENT,
  `id_user` INT(11) NOT NULL,
  `judul` VARCHAR(120) NOT NULL,
  `pesan` TEXT NOT NULL,
  `tipe` ENUM('pengingat_tenggat', 'konfirmasi_booking', 'denda', 'info_sistem') NOT NULL DEFAULT 'info_sistem',
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_notif`),
  KEY `fk_notif_user` (`id_user`),
  CONSTRAINT `fk_notif_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `notifikasi` (`id_notif`, `id_user`, `judul`, `pesan`, `tipe`, `is_read`, `created_at`) VALUES
(1, 3, 'Tenggat Waktu Besok!', 'Buku "Pemrograman Web Modern dengan PHP & MySQL" harus dikembalikan besok (21 Okt 2026).', 'pengingat_tenggat', 0, '2026-10-20 08:00:00'),
(2, 4, 'Peringatan Terlambat & Denda', 'Buku "Laskar Pelangi" melewati tenggat (17 Okt 2026). Denda berjalan saat ini Rp 3.000.', 'denda', 0, '2026-10-20 07:00:00'),
(3, 3, 'Pemesanan Buku Diterima', 'Hold buku "Atomic Habits" berhasil dibuat. Silakan ambil di konter perpustakaan dalam 24 jam.', 'konfirmasi_booking', 1, '2026-10-20 07:45:00');

-- -------------------------------------------------------------
-- 7. Tabel Rekomendasi Bacaan Guru
-- -------------------------------------------------------------
DROP TABLE IF EXISTS `rekomendasi_guru`;
CREATE TABLE `rekomendasi_guru` (
  `id_rekomendasi` INT(11) NOT NULL AUTO_INCREMENT,
  `id_user` INT(11) NOT NULL, -- Guru yang merekomendasikan
  `id_buku` INT(11) NOT NULL,
  `catatan_rekomendasi` TEXT NOT NULL,
  `target_kelas` VARCHAR(50) DEFAULT 'Semua Siswa',
  `rating` INT(1) DEFAULT 5,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_rekomendasi`),
  KEY `fk_rekom_guru` (`id_user`),
  KEY `fk_rekom_buku` (`id_buku`),
  CONSTRAINT `fk_rekom_guru` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON UPDATE CASCADE,
  CONSTRAINT `fk_rekom_buku` FOREIGN KEY (`id_buku`) REFERENCES `buku` (`id_buku`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `rekomendasi_guru` (`id_rekomendasi`, `id_user`, `id_buku`, `catatan_rekomendasi`, `target_kelas`, `rating`) VALUES
(1, 2, 3, 'Sangat direkomendasikan untuk siswa tingkat akhir agar memahami sejarah literasi dan kebangsaan Indonesia.', 'Kelas XI & XII', 5),
(2, 5, 1, 'Buku pegangan wajib untuk siswa kejuruan RPL dalam menyelesaikan proyek akhir web application.', 'XII RPL 1 & 2', 5),
(3, 2, 4, 'Buku pembentuk disiplin belajar dan manajemen waktu bagi seluruh siswa.', 'Semua Tingkat', 5);

SET FOREIGN_KEY_CHECKS = 1;


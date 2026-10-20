# PustakaKita - Sistem Informasi Perpustakaan Digital Sekolah

Aplikasi web modern untuk mendigitalisasi layanan perpustakaan sekolah. Sistem ini dirancang untuk memberikan akses cepat dan efisien bagi pengguna (Siswa, Guru, dan Pustakawan/Admin) dalam mencari, memesan (hold 24 jam), serta mengelola peminjaman dan pengembalian buku secara daring.

---

## 📁 Struktur Direktori & File

```
PUSTAKA/
│
├── index.html                  # Halaman utama aplikasi (UI/UX Lengkap)
├── README.md                   # Dokumentasi teknis & roadmap integrasi
│
├── assets/
│   ├── css/
│   │   └── style.css           # Styling custom, animasi, glassmorphism, badge
│   └── js/
│       ├── data-dump.js        # Data dump mock (identik dengan SQL) & Engine LocalStorage
│       └── app.js              # Interaktivitas UI, role switcher, Chart.js, filter, & modal
│
└── database/
    └── pustakakita.sql         # Database Dump lengkap (Tabel, Relasi FK, & Data Seed)
```

---

## 🌟 8 Fitur Utama yang Telah Diimplementasikan

1. **Pencarian & Filter Cepat**:
   - Pencarian instan (real-time) berdasarkan judul buku, pengarang, penerbit, maupun ISBN.
   - Filter cepat berdasarkan kategori (Teknologi & Komputer, Sains, Sastra, Sejarah, Pengembangan Diri, Referensi).
   - Filter saklar: *Hanya Buku yang Tersedia*.
   - Pengurutan: Paling banyak dibaca, Alfabetis A-Z, dan Tahun terbit.

2. **Katalog Buku Digital**:
   - Menampilkan kartu buku lengkap dengan sampul gambar, indikator stok interaktif (`Tersedia: x / y` atau `Stok Habis`).
   - Penunjuk lokasi rak fisik di perpustakaan (contoh: *Rak Teknologi Lt. 1 Sayap Timur*).

3. **Pemesanan Buku Online (Hold / Booking 24 Jam)**:
   - Siswa atau Guru dapat memesan buku terlebih dahulu agar tidak diambil orang lain sebelum datang ke perpustakaan sekolah.
   - Mengurangi stok tersedia secara otomatis dan mencatat kode transaksi booking unik.

4. **Manajemen Peminjaman & Pengembalian**:
   - Durasi peminjaman otomatis (standar 7 hari).
   - Perhitungan denda otomatis (Rp 1.000 / hari) jika melewati tenggat pengembalian.
   - Riwayat peminjaman bagi pengguna dan tombol persetujuan cepat bagi pustakawan.

5. **Notifikasi Pengingat**:
   - Drawer notifikasi dan badge penanda belum dibaca.
   - Mengingatkan siswa saat H-1 sebelum batas pengembalian, status denda aktif, serta konfirmasi buku siap diambil.

6. **Dashboard Analitik Admin / Pustakawan**:
   - 4 Kartu KPI: Total Judul Buku, Total Eksemplar Fisik, Peminjaman Aktif, dan Total Denda Keterlambatan.
   - **Grafik Tren Sirkulasi Mingguan**: Visualisasi pergerakan peminjaman & pengembalian buku harian (Chart.js).
   - **Grafik Distribusi Kategori**: Diagram lingkaran (doughnut) komposisi bidang ilmu buku.
   - Tabel persetujuan booking & proses pengembalian buku 1-klik.

7. **Form Input Data Buku & Manajemen (CRUD)**:
   - Form modal untuk menambahkan buku baru lengkap dengan ISBN, penerbit, kategori, rak, dan stok.
   - Fitur edit data buku dan hapus koleksi dari basis data.

8. **Pengaturan Profil Pengguna & Switch Role**:
   - Simulator role switcher di bagian atas header:
     - 👨‍🎓 **Siswa**: Budi Pratama (XII RPL 1) & Siti Nurhaliza (XI IPA 2)
     - 👨‍🏫 **Guru**: Drs. Hendra Gunawan, M.Pd. (Dapat memberi rekomendasi bacaan buku)
     - 👩‍💼 **Pustakawan / Admin**: Dewi Sartika, S.I.Pust. (Akses penuh Dashboard Analitik & CRUD Buku)
   - Kartu profil ringkasan statistik bacaan pribadi dan pengaturan kata sandi.

---

## 🗄️ Spesifikasi Database (`database/pustakakita.sql`)

Database dump telah disiapkan untuk **MySQL / MariaDB (XAMPP)** dengan skema relasional:
- `users`: ID, NIS/NIP, Nama, Email, Password, Role (`siswa`, `guru`, `admin`), Kelas/Jurusan, Kontak, Status.
- `kategori`: ID, Nama Kategori, Slug, Ikon FontAwesome, Deskripsi.
- `rak`: ID, Kode Rak, Nama Rak, Lokasi Gedung, Lantai.
- `buku`: ID, ISBN, Judul, Pengarang, Penerbit, Tahun, ID Kategori (FK), ID Rak (FK), Stok Total, Stok Tersedia, Deskripsi, Sampul.
- `transaksi`: ID, Kode TRX, ID User (FK), ID Buku (FK), Tgl Booking, Tgl Pinjam, Tenggat Kembali, Tgl Kembali, Status (`booking`, `dipinjam`, `dikembalikan`, `denda_lunas`, `batal`), Denda, Catatan.
- `notifikasi`: ID, ID User (FK), Judul, Pesan, Tipe, Is Read.
- `rekomendasi_guru`: ID, ID User/Guru (FK), ID Buku (FK), Catatan Rekomendasi, Target Kelas, Rating.

---

## 🚀 Cara Menjalankan Prototype Saat Ini

1. Buka folder `c:\xamppPUTRA\htdocs\PUSTAKA\` di web browser dengan salah satu cara:
   - **Melalui Apache XAMPP**: Jalankan Apache di XAMPP Control Panel, lalu buka `http://localhost/PUSTAKA/`
   - **Atau langsung klik ganda file**: Buka file [index.html](file:///c:/xamppPUTRA/htdocs/PUSTAKA/index.html) di Google Chrome / Edge / Firefox.
2. Coba ganti pengguna di dropdown atas (*👨‍🎓 Budi Pratama*, *👨‍🏫 Drs. Hendra Gunawan*, atau *👩‍💼 Dewi Sartika*) untuk melihat tampilan sesuai peran pengguna masing-masing.
3. Anda dapat memesan buku, menambah buku baru sebagai admin, memproses pengembalian, dan semua perubahan tersimpan rapi di browser! Terdapat tombol **Reset Demo** jika ingin mengembalikan ke dump data awal.

---

## 🔌 Roadmap Saat Ada Perintah Menyambungkan ke PHP & Database

Ketika Anda memberikan instruksi berikutnya untuk menghubungkan sistem ini ke PHP dan MySQL:
1. Import file `database/pustakakita.sql` melalui **phpMyAdmin** (`http://localhost/phpmyadmin`).
2. Buat konfigurasi koneksi PDO/MySQLi: `config/koneksi.php`.
3. Buat API / file pemrosesan backend PHP:
   - `auth/login.php`, `auth/logout.php` (autentikasi session & password hash)
   - `api/buku.php` (SELECT, INSERT, UPDATE, DELETE buku)
   - `api/transaksi.php` (booking, pinjam, kembali, hitung denda otomatis)
   - `api/notifikasi.php`
4. Ganti pemanggilan `PustakaDB` di [app.js](file:///c:/xamppPUTRA/htdocs/PUSTAKA/assets/js/app.js) dengan `fetch('api/...')` atau ubah halaman menjadi template modular PHP (`header.php`, `footer.php`, `katalog.php`, `dashboard.php`).

# PustakaKita

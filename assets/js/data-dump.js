/**
 * PustakaKita - Dump Data & Local Storage Layer
 * File ini menyediakan data awal (mock dump) yang identik dengan file pustakakita.sql
 * Saat nanti sistem diintegrasikan ke PHP & MySQL, pemanggilan PustakaDB cukup digantikan
 * dengan panggilan API Fetch / AJAX ke backend endpoint PHP (contoh: api/books.php).
 */

const INITIAL_DUMP_DATA = {
  kategori: [
    { id_kategori: 1, nama_kategori: 'Teknologi & Komputer', slug: 'teknologi-komputer', icon: 'fa-laptop-code', deskripsi: 'Buku pemrograman, web development, dan kecerdasan buatan' },
    { id_kategori: 2, nama_kategori: 'Sains & Matematika', slug: 'sains-matematika', icon: 'fa-atom', deskripsi: 'Buku fisika, kimia, biologi, dan matematika sekolah' },
    { id_kategori: 3, nama_kategori: 'Sastra & Fiksi', slug: 'sastra-fiksi', icon: 'fa-feather-pointed', deskripsi: 'Novel, antologi puisi, cerpen karya sastrawan terkemuka' },
    { id_kategori: 4, nama_kategori: 'Sejarah & Sosial', slug: 'sejarah-sosial', icon: 'fa-landmark', deskripsi: 'Buku sejarah peradaban, sosiologi, dan geografi' },
    { id_kategori: 5, nama_kategori: 'Pengembangan Diri', slug: 'pengembangan-diri', icon: 'fa-brain', deskripsi: 'Buku motivasi, produktivitas, kepemimpinan, dan psikologi populer' },
    { id_kategori: 6, nama_kategori: 'Referensi & Bahasa', slug: 'referensi-bahasa', icon: 'fa-spell-check', deskripsi: 'Kamus, ensiklopedia, panduan tata bahasa Indonesia & asing' }
  ],

  rak: [
    { id_rak: 1, kode_rak: 'RAK-TK-01', nama_rak: 'Rak Teknologi & Pemrograman', lokasi: 'Sayap Timur', lantai: 1 },
    { id_rak: 2, kode_rak: 'RAK-SM-02', nama_rak: 'Rak MIPA & Laboratorium', lokasi: 'Sayap Barat', lantai: 1 },
    { id_rak: 3, kode_rak: 'RAK-SF-03', nama_rak: 'Rak Sastra & Novel Populer', lokasi: 'Lantai 2 Tengah', lantai: 2 },
    { id_rak: 4, kode_rak: 'RAK-SS-04', nama_rak: 'Rak Sejarah & Geografi', lokasi: 'Lantai 2 Sayap Barat', lantai: 2 },
    { id_rak: 5, kode_rak: 'RAK-PD-05', nama_rak: 'Rak Self Improvement & Karir', lokasi: 'Sayap Timur', lantai: 1 },
    { id_rak: 6, kode_rak: 'RAK-RF-06', nama_rak: 'Rak Ensiklopedia & Referensi Guru', lokasi: 'Ruang Referensi Khusus', lantai: 2 }
  ],

  users: [
    {
      id_user: 1,
      nis_nip: 'ADM-2026-001',
      nama_lengkap: 'Dewi Sartika, S.I.Pust.',
      email: 'dewi.admin@pustakakita.sch.id',
      role: 'admin',
      kelas_jurusan: 'Kepala Perpustakaan',
      no_telepon: '081234567801',
      foto_profil: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      status_aktif: 'aktif'
    },
    {
      id_user: 2,
      nis_nip: 'GUR-1985-007',
      nama_lengkap: 'Drs. Hendra Gunawan, M.Pd.',
      email: 'hendra.guru@pustakakita.sch.id',
      role: 'guru',
      kelas_jurusan: 'Guru Bahasa & Sastra',
      no_telepon: '081234567802',
      foto_profil: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
      status_aktif: 'aktif'
    },
    {
      id_user: 3,
      nis_nip: 'SIS-2024-101',
      nama_lengkap: 'Budi Pratama',
      email: 'budi.siswa@pustakakita.sch.id',
      role: 'siswa',
      kelas_jurusan: 'XII RPL 1',
      no_telepon: '081234567803',
      foto_profil: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      status_aktif: 'aktif'
    },
    {
      id_user: 4,
      nis_nip: 'SIS-2024-102',
      nama_lengkap: 'Siti Nurhaliza',
      email: 'siti.siswa@pustakakita.sch.id',
      role: 'siswa',
      kelas_jurusan: 'XI IPA 2',
      no_telepon: '081234567804',
      foto_profil: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      status_aktif: 'aktif'
    },
    {
      id_user: 5,
      nis_nip: 'GUR-1990-012',
      nama_lengkap: 'Ratna Kusuma, S.Kom.',
      email: 'ratna.guru@pustakakita.sch.id',
      role: 'guru',
      kelas_jurusan: 'Guru Informatika & RPL',
      no_telepon: '081234567805',
      foto_profil: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      status_aktif: 'aktif'
    }
  ],

  buku: [
    {
      id_buku: 1,
      isbn: '978-602-06-3317-6',
      judul: 'Pemrograman Web Modern dengan PHP & MySQL',
      pengarang: 'Budi Raharjo',
      penerbit: 'Informatika Bandung',
      tahun_terbit: 2023,
      id_kategori: 1,
      id_rak: 1,
      stok_total: 8,
      stok_tersedia: 5,
      halaman: 420,
      bahasa: 'Indonesia',
      populer_count: 42,
      sampul_gambar: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
      deskripsi: 'Panduan komprehensif merancang aplikasi web modern dari dasar hingga mahir, mencakup OOP PHP, MySQLi, PDO, dan arsitektur MVC.'
    },
    {
      id_buku: 2,
      isbn: '978-979-3062-79-2',
      judul: 'Laskar Pelangi',
      pengarang: 'Andrea Hirata',
      penerbit: 'Bentang Pustaka',
      tahun_terbit: 2019,
      id_kategori: 3,
      id_rak: 3,
      stok_total: 10,
      stok_tersedia: 2,
      halaman: 529,
      bahasa: 'Indonesia',
      populer_count: 98,
      sampul_gambar: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
      deskripsi: 'Kisah inspiratif tentang perjuangan sepuluh anak di Belitung dalam menempuh pendidikan di sekolah Muhammadiyah yang serba terbatas.'
    },
    {
      id_buku: 3,
      isbn: '978-602-03-8591-4',
      judul: 'Bumi Manusia (Tetralogi Buru #1)',
      pengarang: 'Pramoedya Ananta Toer',
      penerbit: 'Lentera Dipantara',
      tahun_terbit: 2021,
      id_kategori: 3,
      id_rak: 3,
      stok_total: 6,
      stok_tersedia: 1,
      halaman: 535,
      bahasa: 'Indonesia',
      populer_count: 76,
      sampul_gambar: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
      deskripsi: 'Karya masterpiece sastra Indonesia yang memotret pergulatan batin Minke di era kolonial Hindia Belanda dan cinta tragisnya dengan Annelies.'
    },
    {
      id_buku: 4,
      isbn: '978-623-00-2441-2',
      judul: 'Atomic Habits: Perubahan Kecil Berdampak Luar Biasa',
      pengarang: 'James Clear',
      penerbit: 'Gramedia Pustaka Utama',
      tahun_terbit: 2022,
      id_kategori: 5,
      id_rak: 5,
      stok_total: 5,
      stok_tersedia: 3,
      halaman: 356,
      bahasa: 'Indonesia',
      populer_count: 89,
      sampul_gambar: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400',
      deskripsi: 'Sebuah metode praktis dan terbukti untuk membentuk kebiasaan baik, menghilangkan kebiasaan buruk, dan menguasai perilaku kecil yang menghasilkan lonjakan prestasi.'
    },
    {
      id_buku: 5,
      isbn: '978-602-444-123-8',
      judul: 'Fisika Dasar untuk Sains & Teknik Edisi 7',
      pengarang: 'David Halliday & Robert Resnick',
      penerbit: 'Erlangga',
      tahun_terbit: 2020,
      id_kategori: 2,
      id_rak: 2,
      stok_total: 4,
      stok_tersedia: 4,
      halaman: 680,
      bahasa: 'Indonesia',
      populer_count: 28,
      sampul_gambar: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400',
      deskripsi: 'Buku referensi wajib fisika mencakup mekanika klasik, gelombang, termodinamika, dan elektromagnetisme dengan latihan soal mendalam.'
    },
    {
      id_buku: 6,
      isbn: '978-602-291-234-1',
      judul: 'Sejarah Peradaban Islam Lengkap',
      pengarang: 'Dr. Badri Yatim, M.A.',
      penerbit: 'Rajawali Pers',
      tahun_terbit: 2021,
      id_kategori: 4,
      id_rak: 4,
      stok_total: 5,
      stok_tersedia: 5,
      halaman: 388,
      bahasa: 'Indonesia',
      populer_count: 19,
      sampul_gambar: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400',
      deskripsi: 'Melacak jejak sejarah perkembangan peradaban Islam sejak masa kenabian, khulafaur rasyidin, dinasti Umayyah, Abbasiyah, hingga penyebaran di Nusantara.'
    },
    {
      id_buku: 7,
      isbn: '978-602-06-4890-3',
      judul: 'Kecerdasan Buatan & Machine Learning Praktis',
      pengarang: 'Yuniar Supardi',
      penerbit: 'Elex Media Komputindo',
      tahun_terbit: 2023,
      id_kategori: 1,
      id_rak: 1,
      stok_total: 6,
      stok_tersedia: 6,
      halaman: 312,
      bahasa: 'Indonesia',
      populer_count: 34,
      sampul_gambar: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400',
      deskripsi: 'Mengenal konsep dasar Artificial Intelligence, Python data science, neural networks, dan implementasi computer vision secara praktis.'
    },
    {
      id_buku: 8,
      isbn: '978-602-03-2478-4',
      judul: 'Filosofi Teras: Stoisisme untuk Mental Tangguh',
      pengarang: 'Henry Manampiring',
      penerbit: 'Kompas Buku',
      tahun_terbit: 2022,
      id_kategori: 5,
      id_rak: 5,
      stok_total: 7,
      stok_tersedia: 0,
      halaman: 344,
      bahasa: 'Indonesia',
      populer_count: 110,
      sampul_gambar: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400',
      deskripsi: 'Penerapan filsafat Yunani-Romawi Kuno Stoikisme untuk membantu generasi muda mengatasi rasa khawatir berlebihan dan emosi negatif.'
    }
  ],

  transaksi: [
    {
      id_transaksi: 1,
      kode_transaksi: 'TRX-202610-001',
      id_user: 3,
      id_buku: 1,
      tgl_booking: '2026-10-14 09:00',
      tgl_pinjam: '2026-10-14',
      tenggat_kembali: '2026-10-21',
      tgl_kembali: null,
      status: 'dipinjam',
      denda: 0,
      catatan: 'Peminjaman materi kejuruan Rekayasa Perangkat Lunak'
    },
    {
      id_transaksi: 2,
      kode_transaksi: 'TRX-202610-002',
      id_user: 4,
      id_buku: 2,
      tgl_booking: '2026-10-10 11:20',
      tgl_pinjam: '2026-10-10',
      tenggat_kembali: '2026-10-17',
      tgl_kembali: null,
      status: 'dipinjam',
      denda: 3000,
      catatan: 'Terlambat 3 hari (Tarif denda Rp 1.000/hari)'
    },
    {
      id_transaksi: 3,
      kode_transaksi: 'TRX-202610-003',
      id_user: 2,
      id_buku: 5,
      tgl_booking: '2026-10-01 08:30',
      tgl_pinjam: '2026-10-01',
      tenggat_kembali: '2026-10-14',
      tgl_kembali: '2026-10-12',
      status: 'dikembalikan',
      denda: 0,
      catatan: 'Referensi materi praktikum IPA'
    },
    {
      id_transaksi: 4,
      kode_transaksi: 'TRX-202610-004',
      id_user: 3,
      id_buku: 4,
      tgl_booking: '2026-10-20 07:45',
      tgl_pinjam: null,
      tenggat_kembali: null,
      tgl_kembali: null,
      status: 'booking',
      denda: 0,
      catatan: 'Pemesanan online (Hold 24 Jam)'
    },
    {
      id_transaksi: 5,
      kode_transaksi: 'TRX-202610-005',
      id_user: 4,
      id_buku: 8,
      tgl_booking: '2026-10-19 14:10',
      tgl_pinjam: '2026-10-19',
      tenggat_kembali: '2026-10-26',
      tgl_kembali: null,
      status: 'dipinjam',
      denda: 0,
      catatan: 'Peminjaman di perpustakaan'
    }
  ],

  notifikasi: [
    {
      id_notif: 1,
      id_user: 3,
      judul: 'Tenggat Waktu Besok!',
      pesan: 'Buku "Pemrograman Web Modern dengan PHP & MySQL" harus dikembalikan besok (21 Okt 2026).',
      tipe: 'pengingat_tenggat',
      is_read: false,
      waktu: '1 jam yang lalu'
    },
    {
      id_notif: 2,
      id_user: 4,
      judul: 'Peringatan Terlambat & Denda',
      pesan: 'Buku "Laskar Pelangi" telah melewati batas pengembalian. Denda berjalan saat ini Rp 3.000.',
      tipe: 'denda',
      is_read: false,
      waktu: '3 jam yang lalu'
    },
    {
      id_notif: 3,
      id_user: 3,
      judul: 'Pemesanan Buku Diterima',
      pesan: 'Hold buku "Atomic Habits" berhasil dibuat. Silakan ambil di konter perpustakaan dalam waktu 24 jam.',
      tipe: 'konfirmasi_booking',
      is_read: true,
      waktu: 'Kemarin'
    }
  ],

  rekomendasi_guru: [
    {
      id_rekomendasi: 1,
      id_user: 2,
      id_buku: 3,
      catatan_rekomendasi: 'Sangat direkomendasikan untuk siswa tingkat akhir agar memahami sejarah literasi dan kebangsaan Indonesia.',
      target_kelas: 'Kelas XI & XII',
      rating: 5
    },
    {
      id_rekomendasi: 2,
      id_user: 5,
      id_buku: 1,
      catatan_rekomendasi: 'Buku pegangan wajib untuk siswa kejuruan RPL dalam menyelesaikan proyek akhir web application.',
      target_kelas: 'XII RPL 1 & 2',
      rating: 5
    },
    {
      id_rekomendasi: 3,
      id_user: 2,
      id_buku: 4,
      catatan_rekomendasi: 'Buku pembentuk disiplin belajar dan manajemen waktu bagi seluruh siswa.',
      target_kelas: 'Semua Tingkat',
      rating: 5
    }
  ]
};

// ==============================================================
// Database Manager (LocalStorage Engine)
// ==============================================================
class PustakaDBEngine {
  constructor() {
    this.STORAGE_KEY = 'PUSTAKAKITA_DATA_V1';
    this.CURRENT_USER_KEY = 'PUSTAKAKITA_CURRENT_USER_V1';
    this.init();
  }

  init() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      this.resetToDefault();
    }
    if (!localStorage.getItem(this.CURRENT_USER_KEY)) {
      // Default: Budi Pratama (Siswa)
      this.setCurrentUserId(3);
    }
  }

  getData() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : JSON.parse(JSON.stringify(INITIAL_DUMP_DATA));
    } catch (e) {
      console.error('Error reading localStorage, resetting:', e);
      return JSON.parse(JSON.stringify(INITIAL_DUMP_DATA));
    }
  }

  saveData(data) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  resetToDefault() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(INITIAL_DUMP_DATA));
  }

  // --- Users & Current Auth ---
  getUsers() {
    return this.getData().users;
  }

  getCurrentUserId() {
    return parseInt(localStorage.getItem(this.CURRENT_USER_KEY) || '3', 10);
  }

  getCurrentUser() {
    const users = this.getUsers();
    const id = this.getCurrentUserId();
    return users.find(u => u.id_user === id) || users[2];
  }

  setCurrentUserId(id) {
    localStorage.setItem(this.CURRENT_USER_KEY, id.toString());
  }

  // --- Categories & Raks ---
  getKategori() {
    return this.getData().kategori;
  }

  getRak() {
    return this.getData().rak;
  }

  // --- Books ---
  getBooks() {
    return this.getData().buku;
  }

  getBookById(id) {
    return this.getBooks().find(b => b.id_buku === parseInt(id, 10));
  }

  addBook(bookData) {
    const data = this.getData();
    const newId = data.buku.length > 0 ? Math.max(...data.buku.map(b => b.id_buku)) + 1 : 1;
    const newBook = {
      id_buku: newId,
      isbn: bookData.isbn || `978-602-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10 + Math.random() * 90)}-0`,
      judul: bookData.judul,
      pengarang: bookData.pengarang,
      penerbit: bookData.penerbit,
      tahun_terbit: parseInt(bookData.tahun_terbit, 10) || new Date().getFullYear(),
      id_kategori: parseInt(bookData.id_kategori, 10) || 1,
      id_rak: parseInt(bookData.id_rak, 10) || 1,
      stok_total: parseInt(bookData.stok_total, 10) || 1,
      stok_tersedia: parseInt(bookData.stok_total, 10) || 1,
      halaman: parseInt(bookData.halaman, 10) || 200,
      bahasa: bookData.bahasa || 'Indonesia',
      populer_count: 0,
      sampul_gambar: bookData.sampul_gambar || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
      deskripsi: bookData.deskripsi || 'Belum ada sinopsis buku.'
    };
    data.buku.unshift(newBook);
    this.saveData(data);
    return newBook;
  }

  updateBook(id, updateData) {
    const data = this.getData();
    const index = data.buku.findIndex(b => b.id_buku === parseInt(id, 10));
    if (index !== -1) {
      data.buku[index] = { ...data.buku[index], ...updateData };
      this.saveData(data);
      return data.buku[index];
    }
    return null;
  }

  deleteBook(id) {
    const data = this.getData();
    data.buku = data.buku.filter(b => b.id_buku !== parseInt(id, 10));
    this.saveData(data);
    return true;
  }

  // --- Transactions (Booking & Loans) ---
  getTransactions() {
    return this.getData().transaksi;
  }

  createBooking(idUser, idBuku) {
    const data = this.getData();
    const book = data.buku.find(b => b.id_buku === parseInt(idBuku, 10));
    if (!book || book.stok_tersedia <= 0) {
      return { success: false, message: 'Maaf, stok buku ini sedang habis.' };
    }

    // Check if user already booked or borrowed this book
    const existing = data.transaksi.find(
      t => t.id_user === parseInt(idUser, 10) && t.id_buku === parseInt(idBuku, 10) && ['booking', 'dipinjam'].includes(t.status)
    );
    if (existing) {
      return { success: false, message: 'Anda sudah memiliki pemesanan atau peminjaman aktif untuk buku ini.' };
    }

    // Reduce available stock
    book.stok_tersedia -= 1;
    book.populer_count += 1;

    // Create new transaction
    const newTrxId = data.transaksi.length > 0 ? Math.max(...data.transaksi.map(t => t.id_transaksi)) + 1 : 1;
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

    const newTrx = {
      id_transaksi: newTrxId,
      kode_transaksi: `TRX-${now.getFullYear()}${pad(now.getMonth() + 1)}-${newTrxId.toString().padStart(3, '0')}`,
      id_user: parseInt(idUser, 10),
      id_buku: parseInt(idBuku, 10),
      tgl_booking: dateStr,
      tgl_pinjam: null,
      tenggat_kembali: null,
      tgl_kembali: null,
      status: 'booking',
      denda: 0,
      catatan: 'Pemesanan online (Hold 24 Jam di perpustakaan)'
    };

    data.transaksi.unshift(newTrx);

    // Create notification
    const newNotif = {
      id_notif: data.notifikasi.length + 1,
      id_user: parseInt(idUser, 10),
      judul: 'Pemesanan Berhasil!',
      pesan: `Buku "${book.judul}" berhasil di-booking. Harap ambil di perpustakaan dalam waktu 24 jam.`,
      tipe: 'konfirmasi_booking',
      is_read: false,
      waktu: 'Baru saja'
    };
    data.notifikasi.unshift(newNotif);

    this.saveData(data);
    return { success: true, transaction: newTrx, message: 'Buku berhasil dipesan! Silakan tunjukkan kode booking ke petugas perpustakaan.' };
  }

  approveLoan(idTransaksi) {
    const data = this.getData();
    const trx = data.transaksi.find(t => t.id_transaksi === parseInt(idTransaksi, 10));
    if (!trx) return false;

    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

    // Tenggat pengembalian: 7 hari ke depan
    const returnDate = new Date();
    returnDate.setDate(now.getDate() + 7);
    const returnStr = `${returnDate.getFullYear()}-${pad(returnDate.getMonth() + 1)}-${pad(returnDate.getDate())}`;

    trx.status = 'dipinjam';
    trx.tgl_pinjam = todayStr;
    trx.tenggat_kembali = returnStr;

    // Tambah notifikasi untuk peminjam
    const book = data.buku.find(b => b.id_buku === trx.id_buku);
    data.notifikasi.unshift({
      id_notif: data.notifikasi.length + 1,
      id_user: trx.id_user,
      judul: 'Peminjaman Dikonfirmasi',
      pesan: `Peminjaman buku "${book ? book.judul : 'Buku'}" telah aktif. Batas pengembalian: ${returnStr}.`,
      tipe: 'info_sistem',
      is_read: false,
      waktu: 'Baru saja'
    });

    this.saveData(data);
    return true;
  }

  returnBook(idTransaksi) {
    const data = this.getData();
    const trx = data.transaksi.find(t => t.id_transaksi === parseInt(idTransaksi, 10));
    if (!trx) return false;

    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

    trx.status = 'dikembalikan';
    trx.tgl_kembali = todayStr;

    // Kembalikan stok buku
    const book = data.buku.find(b => b.id_buku === trx.id_buku);
    if (book && book.stok_tersedia < book.stok_total) {
      book.stok_tersedia += 1;
    }

    this.saveData(data);
    return true;
  }

  cancelBooking(idTransaksi) {
    const data = this.getData();
    const trx = data.transaksi.find(t => t.id_transaksi === parseInt(idTransaksi, 10));
    if (!trx || trx.status !== 'booking') return false;

    trx.status = 'batal';

    // Pulihkan stok buku
    const book = data.buku.find(b => b.id_buku === trx.id_buku);
    if (book && book.stok_tersedia < book.stok_total) {
      book.stok_tersedia += 1;
    }

    this.saveData(data);
    return true;
  }

  // --- Notifications ---
  getNotifications(userId) {
    const data = this.getData();
    return data.notifikasi.filter(n => n.id_user === parseInt(userId, 10));
  }

  markAllNotificationsRead(userId) {
    const data = this.getData();
    data.notifikasi.forEach(n => {
      if (n.id_user === parseInt(userId, 10)) {
        n.is_read = true;
      }
    });
    this.saveData(data);
  }

  // --- Teacher Recommendations ---
  getRecommendations() {
    return this.getData().rekomendasi_guru;
  }

  addRecommendation(recData) {
    const data = this.getData();
    const newId = data.rekomendasi_guru.length > 0 ? Math.max(...data.rekomendasi_guru.map(r => r.id_rekomendasi)) + 1 : 1;
    data.rekomendasi_guru.unshift({
      id_rekomendasi: newId,
      id_user: recData.id_user,
      id_buku: parseInt(recData.id_buku, 10),
      catatan_rekomendasi: recData.catatan_rekomendasi,
      target_kelas: recData.target_kelas || 'Semua Siswa',
      rating: parseInt(recData.rating, 10) || 5
    });
    this.saveData(data);
    return true;
  }
}

// Global Singleton Instance
window.PustakaDB = new PustakaDBEngine();


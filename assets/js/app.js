/**
 * PustakaKita - Main Application Logic & UI Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    currentTab: 'katalog',
    currentUser: null,
    searchQuery: '',
    selectedCategory: 'all',
    onlyAvailable: false,
    sortBy: 'populer',
    analyticsChartLoan: null,
    analyticsChartCategory: null
  };

  // Helper Elements
  const el = (id) => document.getElementById(id);

  // Initialize
  function initApp() {
    updateCurrentUser();
    setupEventListeners();
    renderNavigation();
    renderKatalog();
    renderNotifications();
  }

  // Current User Management
  function updateCurrentUser() {
    state.currentUser = window.PustakaDB.getCurrentUser();
    
    // Update Header Profile
    const avatarEl = el('nav-user-avatar');
    const nameEl = el('nav-user-name');
    const roleBadgeEl = el('nav-user-role-badge');
    const roleSelector = el('role-quick-switcher');

    if (avatarEl) avatarEl.src = state.currentUser.foto_profil;
    if (nameEl) nameEl.textContent = state.currentUser.nama_lengkap;
    if (roleSelector) roleSelector.value = state.currentUser.id_user;

    if (roleBadgeEl) {
      let badgeStyle = 'bg-blue-100 text-blue-700 border-blue-200';
      let roleText = 'Siswa';
      if (state.currentUser.role === 'admin') {
        badgeStyle = 'bg-purple-100 text-purple-700 border-purple-200';
        roleText = 'Pustakawan / Admin';
      } else if (state.currentUser.role === 'guru') {
        badgeStyle = 'bg-emerald-100 text-emerald-700 border-emerald-200';
        roleText = 'Guru';
      }
      roleBadgeEl.className = `text-xs font-semibold px-2.5 py-0.5 rounded-full border ${badgeStyle}`;
      roleBadgeEl.textContent = roleText;
    }

    // Role-dependent tab visibility
    const adminNavItems = document.querySelectorAll('.nav-admin-only');
    const userNavItems = document.querySelectorAll('.nav-user-only');

    if (state.currentUser.role === 'admin') {
      adminNavItems.forEach(item => item.classList.remove('hidden'));
      userNavItems.forEach(item => item.classList.add('hidden'));
    } else {
      adminNavItems.forEach(item => item.classList.add('hidden'));
      userNavItems.forEach(item => item.classList.remove('hidden'));
    }

    renderNotifications();
  }

  // Tab Navigation Handling
  function switchTab(tabId) {
    state.currentTab = tabId;

    // Update active nav button styles
    document.querySelectorAll('.nav-link-btn').forEach(btn => {
      if (btn.dataset.tab === tabId) {
        btn.classList.add('bg-blue-600', 'text-white', 'shadow-sm');
        btn.classList.remove('text-slate-600', 'hover:bg-slate-100');
      } else {
        btn.classList.remove('bg-blue-600', 'text-white', 'shadow-sm');
        btn.classList.add('text-slate-600', 'hover:bg-slate-100');
      }
    });

    // Toggle view containers
    const tabContainers = ['katalog', 'peminjaman', 'rekomendasi', 'admin-dashboard', 'profil'];
    tabContainers.forEach(name => {
      const view = el(`view-${name}`);
      if (view) {
        if (name === tabId) {
          view.classList.remove('hidden');
          view.classList.add('animate-fade-in');
        } else {
          view.classList.add('hidden');
        }
      }
    });

    // Tab-specific initializers
    if (tabId === 'katalog') {
      renderKatalog();
    } else if (tabId === 'peminjaman') {
      renderPeminjamanSaya();
    } else if (tabId === 'rekomendasi') {
      renderRekomendasiGuru();
    } else if (tabId === 'admin-dashboard') {
      renderAdminDashboard();
    } else if (tabId === 'profil') {
      renderProfil();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Setup Global Event Listeners
  function setupEventListeners() {
    // Quick Role Switcher
    const roleSwitcher = el('role-quick-switcher');
    if (roleSwitcher) {
      roleSwitcher.addEventListener('change', (e) => {
        const selectedId = parseInt(e.target.value, 10);
        window.PustakaDB.setCurrentUserId(selectedId);
        updateCurrentUser();

        // If admin selected and on user tab, switch to dashboard or katalog
        if (state.currentUser.role === 'admin' && (state.currentTab === 'peminjaman' || state.currentTab === 'rekomendasi')) {
          switchTab('admin-dashboard');
        } else if (state.currentUser.role !== 'admin' && state.currentTab === 'admin-dashboard') {
          switchTab('katalog');
        } else {
          switchTab(state.currentTab);
        }

        showToast(`Beralih peran sebagai: ${state.currentUser.nama_lengkap} (${state.currentUser.role.toUpperCase()})`, 'info');
      });
    }

    // Reset Data Dump Button
    const btnResetData = el('btn-reset-dump-data');
    if (btnResetData) {
      btnResetData.addEventListener('click', () => {
        if (confirm('Kembalikan semua data ke pengaturan awal database dump? Semua penambahan/peminjaman baru akan di-reset.')) {
          window.PustakaDB.resetToDefault();
          updateCurrentUser();
          switchTab('katalog');
          showToast('Data berhasil di-reset ke database dump awal!', 'success');
        }
      });
    }

    // Nav Link Clicks
    document.querySelectorAll('.nav-link-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = btn.dataset.tab;
        if (tab) switchTab(tab);
      });
    });

    // Search Input
    const searchInput = el('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.toLowerCase().trim();
        renderKatalog();
      });
    }

    // Filter Category Chips
    const categoryContainer = el('category-chips-container');
    if (categoryContainer) {
      categoryContainer.addEventListener('click', (e) => {
        const chip = e.target.closest('.category-chip');
        if (chip) {
          document.querySelectorAll('.category-chip').forEach(c => {
            c.classList.remove('bg-blue-600', 'text-white', 'border-blue-600');
            c.classList.add('bg-white', 'text-slate-700', 'border-slate-200');
          });
          chip.classList.add('bg-blue-600', 'text-white', 'border-blue-600');
          chip.classList.remove('bg-white', 'text-slate-700', 'border-slate-200');
          state.selectedCategory = chip.dataset.category;
          renderKatalog();
        }
      });
    }

    // Filter Available Only Toggle
    const toggleAvailable = el('filter-available-only');
    if (toggleAvailable) {
      toggleAvailable.addEventListener('change', (e) => {
        state.onlyAvailable = e.target.checked;
        renderKatalog();
      });
    }

    // Sort Dropdown
    const sortSelect = el('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        renderKatalog();
      });
    }

    // Notification Drawer Trigger
    const btnNotif = el('btn-notification-trigger');
    const notifModal = el('notification-modal');
    const closeNotifBtn = el('btn-close-notif');
    if (btnNotif && notifModal) {
      btnNotif.addEventListener('click', () => {
        notifModal.classList.remove('hidden');
        renderNotificationsList();
      });
    }
    if (closeNotifBtn && notifModal) {
      closeNotifBtn.addEventListener('click', () => {
        notifModal.classList.add('hidden');
      });
    }

    // Mark notifications read
    const btnMarkAllRead = el('btn-mark-all-read');
    if (btnMarkAllRead) {
      btnMarkAllRead.addEventListener('click', () => {
        window.PustakaDB.markAllNotificationsRead(state.currentUser.id_user);
        renderNotifications();
        renderNotificationsList();
        showToast('Semua notifikasi telah ditandai dibaca', 'info');
      });
    }

    // Book Detail Modal Close
    const btnCloseDetail = el('btn-close-book-detail');
    const detailModal = el('modal-book-detail');
    if (btnCloseDetail && detailModal) {
      btnCloseDetail.addEventListener('click', () => {
        detailModal.classList.add('hidden');
      });
      detailModal.addEventListener('click', (e) => {
        if (e.target === detailModal) detailModal.classList.add('hidden');
      });
    }

    // Admin Book Form Modal
    const btnAddBook = el('btn-add-book-modal');
    const bookModal = el('modal-add-edit-book');
    const btnCloseBookForm = el('btn-close-book-form');
    const formBook = el('form-manage-book');

    if (btnAddBook && bookModal) {
      btnAddBook.addEventListener('click', () => {
        formBook.reset();
        el('form-book-id').value = '';
        el('modal-book-title-heading').textContent = 'Tambah Buku Baru ke Katalog';
        populateSelectOptions();
        bookModal.classList.remove('hidden');
      });
    }

    if (btnCloseBookForm && bookModal) {
      btnCloseBookForm.addEventListener('click', () => {
        bookModal.classList.add('hidden');
      });
    }

    if (formBook) {
      formBook.addEventListener('submit', (e) => {
        e.preventDefault();
        saveBookFromForm();
      });
    }

    // Teacher Recommendation Modal
    const btnOpenRec = el('btn-open-add-rec');
    const recModal = el('modal-add-rec');
    const btnCloseRec = el('btn-close-rec-modal');
    const formRec = el('form-add-rec');

    if (btnOpenRec && recModal) {
      btnOpenRec.addEventListener('click', () => {
        formRec.reset();
        populateRecBookSelect();
        recModal.classList.remove('hidden');
      });
    }

    if (btnCloseRec && recModal) {
      btnCloseRec.addEventListener('click', () => {
        recModal.classList.add('hidden');
      });
    }

    if (formRec) {
      formRec.addEventListener('submit', (e) => {
        e.preventDefault();
        const bookId = el('rec-select-book').value;
        const note = el('rec-input-note').value;
        const target = el('rec-input-target').value;

        window.PustakaDB.addRecommendation({
          id_user: state.currentUser.id_user,
          id_buku: bookId,
          catatan_rekomendasi: note,
          target_kelas: target || 'Semua Siswa',
          rating: 5
        });

        recModal.classList.add('hidden');
        renderRekomendasiGuru();
        showToast('Rekomendasi bacaan guru berhasil diterbitkan!', 'success');
      });
    }

    // Profile Form Submit
    const formProfile = el('form-user-profile');
    if (formProfile) {
      formProfile.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Profil dan kata sandi berhasil diperbarui!', 'success');
      });
    }
  }

  function renderNavigation() {
    // Populate Category Chips in Catalog
    const categories = window.PustakaDB.getKategori();
    const container = el('category-chips-container');
    if (container) {
      container.innerHTML = `
        <button class="category-chip px-4 py-2 rounded-xl text-sm font-medium border bg-blue-600 text-white border-blue-600 shadow-sm transition whitespace-nowrap" data-category="all">
          <i class="fa-solid fa-border-all mr-1.5"></i> Semua Kategori
        </button>
      ` + categories.map(cat => `
        <button class="category-chip px-4 py-2 rounded-xl text-sm font-medium border bg-white text-slate-700 border-slate-200 hover:bg-slate-50 transition whitespace-nowrap" data-category="${cat.id_kategori}">
          <i class="fa-solid ${cat.icon || 'fa-book'} mr-1.5 text-blue-500"></i> ${cat.nama_kategori}
        </button>
      `).join('');
    }
  }

  // ==============================================================
  // 1. KATALOG & PENCARIAN BUKU
  // ==============================================================
  function renderKatalog() {
    const bookGrid = el('book-catalog-grid');
    const emptyState = el('catalog-empty-state');
    if (!bookGrid) return;

    let books = window.PustakaDB.getBooks();
    const categories = window.PustakaDB.getKategori();
    const raks = window.PustakaDB.getRak();

    // Filter by Search Query (Title, Author, ISBN, Publisher)
    if (state.searchQuery) {
      books = books.filter(b => 
        b.judul.toLowerCase().includes(state.searchQuery) ||
        b.pengarang.toLowerCase().includes(state.searchQuery) ||
        b.penerbit.toLowerCase().includes(state.searchQuery) ||
        b.isbn.toLowerCase().includes(state.searchQuery)
      );
    }

    // Filter by Category
    if (state.selectedCategory !== 'all') {
      books = books.filter(b => b.id_kategori === parseInt(state.selectedCategory, 10));
    }

    // Filter Available Only
    if (state.onlyAvailable) {
      books = books.filter(b => b.stok_tersedia > 0);
    }

    // Sorting
    if (state.sortBy === 'populer') {
      books.sort((a, b) => b.populer_count - a.populer_count);
    } else if (state.sortBy === 'judul_asc') {
      books.sort((a, b) => a.judul.localeCompare(b.judul));
    } else if (state.sortBy === 'tahun_desc') {
      books.sort((a, b) => b.tahun_terbit - a.tahun_terbit);
    }

    // Update Counter
    const countBadge = el('katalog-total-count');
    if (countBadge) countBadge.textContent = `${books.length} Koleksi Ditemukan`;

    if (books.length === 0) {
      bookGrid.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    bookGrid.innerHTML = books.map(book => {
      const cat = categories.find(c => c.id_kategori === book.id_kategori);
      const rak = raks.find(r => r.id_rak === book.id_rak);
      const isAvailable = book.stok_tersedia > 0;

      return `
        <div class="book-card bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between group">
          <div class="relative overflow-hidden bg-slate-100 h-64 flex items-center justify-center p-4">
            <img src="${book.sampul_gambar}" alt="${book.judul}" class="cover-img h-full max-h-56 object-cover rounded-lg shadow-md group-hover:scale-105 duration-300" onerror="this.src='https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'" />
            <div class="absolute top-3 right-3">
              ${isAvailable 
                ? `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold badge-available shadow-sm"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>Tersedia: ${book.stok_tersedia}/${book.stok_total}</span>`
                : `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold badge-borrowed shadow-sm"><span class="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5"></span>Stok Habis</span>`
              }
            </div>
            <div class="absolute bottom-2 left-3">
              <span class="text-[11px] font-medium bg-black/60 text-white backdrop-blur-sm px-2 py-0.5 rounded-md">
                <i class="fa-solid fa-location-dot text-blue-400 mr-1"></i> ${rak ? rak.nama_rak : 'Rak Utama'}
              </span>
            </div>
          </div>

          <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between text-xs text-blue-600 font-semibold mb-1.5">
                <span><i class="fa-solid ${cat ? cat.icon : 'fa-book'} mr-1"></i> ${cat ? cat.nama_kategori : 'Umum'}</span>
                <span class="text-slate-400 font-normal">${book.tahun_terbit}</span>
              </div>
              <h3 class="font-bold text-slate-800 text-base line-clamp-2 group-hover:text-blue-600 transition mb-1 leading-snug">
                ${book.judul}
              </h3>
              <p class="text-xs text-slate-500 mb-2">Penulis: <span class="font-medium text-slate-700">${book.pengarang}</span></p>
              <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                ${book.deskripsi}
              </p>
            </div>

            <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button onclick="window.AppActions.openBookDetail(${book.id_buku})" class="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs font-semibold transition flex items-center justify-center gap-1.5">
                <i class="fa-solid fa-circle-info"></i> Detail Lengkap
              </button>
              ${isAvailable 
                ? `<button onclick="window.AppActions.handleQuickBooking(${book.id_buku})" class="py-2 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5" title="Pesan sekarang (Hold 24 Jam)">
                    <i class="fa-solid fa-bookmark"></i> Pesan
                  </button>`
                : `<button disabled class="py-2 px-3 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold cursor-not-allowed">
                    Habis
                  </button>`
              }
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // ==============================================================
  // 2. DETAIL BUKU & PEMESANAN (HOLD/BOOKING)
  // ==============================================================
  function openBookDetail(idBuku) {
    const book = window.PustakaDB.getBookById(idBuku);
    if (!book) return;

    const categories = window.PustakaDB.getKategori();
    const raks = window.PustakaDB.getRak();
    const cat = categories.find(c => c.id_kategori === book.id_kategori);
    const rak = raks.find(r => r.id_rak === book.id_rak);

    el('modal-detail-img').src = book.sampul_gambar;
    el('modal-detail-title').textContent = book.judul;
    el('modal-detail-author').textContent = book.pengarang;
    el('modal-detail-publisher').textContent = book.penerbit;
    el('modal-detail-year').textContent = book.tahun_terbit;
    el('modal-detail-isbn').textContent = book.isbn;
    el('modal-detail-pages').textContent = `${book.halaman || 350} Halaman`;
    el('modal-detail-category').textContent = cat ? cat.nama_kategori : '-';
    el('modal-detail-rak').textContent = rak ? `${rak.nama_rak} (${rak.lokasi}, Lt. ${rak.lantai})` : 'Rak Utama';
    el('modal-detail-desc').textContent = book.deskripsi;
    el('modal-detail-stock').textContent = `${book.stok_tersedia} dari ${book.stok_total} buku tersedia`;

    const statusBadge = el('modal-detail-status-badge');
    if (book.stok_tersedia > 0) {
      statusBadge.className = 'px-3 py-1 rounded-full text-xs font-semibold badge-available';
      statusBadge.innerHTML = '<i class="fa-solid fa-circle-check mr-1 text-emerald-600"></i> Siap Dipesan / Dipinjam';
    } else {
      statusBadge.className = 'px-3 py-1 rounded-full text-xs font-semibold badge-borrowed';
      statusBadge.innerHTML = '<i class="fa-solid fa-circle-xmark mr-1 text-rose-600"></i> Semua Sedang Dipinjam';
    }

    // Action button
    const actionContainer = el('modal-detail-action-container');
    if (state.currentUser.role === 'admin') {
      actionContainer.innerHTML = `
        <button onclick="window.AppActions.editBookFromAdmin(${book.id_buku})" class="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-sm transition flex items-center justify-center gap-2">
          <i class="fa-solid fa-pen-to-square"></i> Kelola / Edit Data Buku Ini
        </button>
      `;
    } else {
      if (book.stok_tersedia > 0) {
        actionContainer.innerHTML = `
          <button onclick="window.AppActions.handleBookingFromModal(${book.id_buku})" class="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition flex items-center justify-center gap-2">
            <i class="fa-solid fa-bookmark"></i> Pesan Buku Online (Hold 24 Jam)
          </button>
        `;
      } else {
        actionContainer.innerHTML = `
          <button disabled class="w-full py-3 px-4 rounded-xl bg-slate-200 text-slate-400 font-semibold text-sm cursor-not-allowed flex items-center justify-center gap-2">
            <i class="fa-solid fa-ban"></i> Stok Buku Sedang Kosong
          </button>
        `;
      }
    }

    el('modal-book-detail').classList.remove('hidden');
  }

  function handleBooking(idBuku) {
    const res = window.PustakaDB.createBooking(state.currentUser.id_user, idBuku);
    if (res.success) {
      showToast(res.message, 'success');
      el('modal-book-detail').classList.add('hidden');
      renderKatalog();
      renderNotifications();
      // Auto redirect to active loans tab
      setTimeout(() => switchTab('peminjaman'), 600);
    } else {
      showToast(res.message, 'warning');
    }
  }

  // ==============================================================
  // 3. PEMINJAMAN SAYA & STATUS PENGINGAT
  // ==============================================================
  function renderPeminjamanSaya() {
    const listContainer = el('user-loan-list');
    const emptyLoan = el('empty-user-loans');
    if (!listContainer) return;

    const allTrx = window.PustakaDB.getTransactions();
    const userTrx = allTrx.filter(t => t.id_user === state.currentUser.id_user);

    if (userTrx.length === 0) {
      listContainer.innerHTML = '';
      if (emptyLoan) emptyLoan.classList.remove('hidden');
      return;
    }
    if (emptyLoan) emptyLoan.classList.add('hidden');

    listContainer.innerHTML = userTrx.map(trx => {
      const book = window.PustakaDB.getBookById(trx.id_buku) || {
        judul: 'Buku Tidak Diketahui',
        pengarang: '-',
        sampul_gambar: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'
      };

      let statusBadge = '';
      let deadlineNotice = '';
      let actionBtn = '';

      if (trx.status === 'booking') {
        statusBadge = `<span class="px-2.5 py-1 rounded-full text-xs font-semibold badge-booking"><i class="fa-regular fa-clock mr-1"></i> Menunggu Diambil (Booking)</span>`;
        deadlineNotice = `<p class="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200 mt-2">
          <i class="fa-solid fa-circle-exclamation mr-1 text-amber-500"></i> Harap ambil buku di perpustakaan dalam <strong>24 jam</strong> sejak booking (${trx.tgl_booking}).
        </p>`;
        actionBtn = `<button onclick="window.AppActions.cancelBooking(${trx.id_transaksi})" class="text-xs text-rose-600 hover:text-rose-800 font-semibold px-3 py-1.5 border border-rose-200 rounded-lg hover:bg-rose-50 transition">
          <i class="fa-solid fa-xmark mr-1"></i> Batalkan Booking
        </button>`;
      } else if (trx.status === 'dipinjam') {
        const isLate = trx.denda > 0;
        statusBadge = isLate
          ? `<span class="px-2.5 py-1 rounded-full text-xs font-semibold badge-borrowed pulse-badge"><i class="fa-solid fa-triangle-exclamation mr-1"></i> Melewati Tenggat (Terlambat)</span>`
          : `<span class="px-2.5 py-1 rounded-full text-xs font-semibold badge-available"><i class="fa-solid fa-book-reader mr-1"></i> Sedang Dipinjam</span>`;
        
        deadlineNotice = `
          <div class="mt-2.5 flex flex-wrap gap-2 text-xs">
            <span class="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-200">
              <i class="fa-regular fa-calendar-check mr-1"></i> Tanggal Pinjam: <strong>${trx.tgl_pinjam}</strong>
            </span>
            <span class="${isLate ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-slate-100 text-slate-700 border-slate-200'} px-3 py-1.5 rounded-lg border">
              <i class="fa-solid fa-hourglass-end mr-1"></i> Batas Kembali: <strong>${trx.tenggat_kembali}</strong>
            </span>
            ${isLate ? `<span class="bg-rose-100 text-rose-800 font-bold px-3 py-1.5 rounded-lg border border-rose-300">Denda Berjalan: Rp ${trx.denda.toLocaleString('id-ID')}</span>` : ''}
          </div>
        `;
        actionBtn = `<span class="text-xs text-slate-500 italic"><i class="fa-solid fa-building-columns mr-1"></i> Kembalikan ke loket petugas</span>`;
      } else if (trx.status === 'dikembalikan') {
        statusBadge = `<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200"><i class="fa-solid fa-check mr-1 text-emerald-600"></i> Telah Dikembalikan</span>`;
        deadlineNotice = `<p class="text-xs text-slate-500 mt-2"><i class="fa-solid fa-clock-rotate-left mr-1"></i> Dikembalikan pada tanggal: <strong>${trx.tgl_kembali || '-'}</strong></p>`;
      } else if (trx.status === 'batal') {
        statusBadge = `<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">Dibatalkan</span>`;
      }

      return `
        <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
          <div class="flex items-start gap-4">
            <img src="${book.sampul_gambar}" alt="${book.judul}" class="w-16 h-24 object-cover rounded-lg shadow-sm border border-slate-200 shrink-0" onerror="this.src='https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'" />
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">${trx.kode_transaksi}</span>
                ${statusBadge}
              </div>
              <h4 class="font-bold text-slate-800 text-base leading-snug">${book.judul}</h4>
              <p class="text-xs text-slate-500">Pengarang: <span class="text-slate-700 font-medium">${book.pengarang}</span></p>
              ${deadlineNotice}
            </div>
          </div>
          <div class="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
            ${actionBtn}
          </div>
        </div>
      `;
    }).join('');
  }

  // ==============================================================
  // 4. REKOMENDASI GURU
  // ==============================================================
  function renderRekomendasiGuru() {
    const container = el('teacher-rec-container');
    const btnOpenRec = el('btn-open-add-rec');
    if (!container) return;

    // Show button only if user is Guru
    if (btnOpenRec) {
      if (state.currentUser.role === 'guru') {
        btnOpenRec.classList.remove('hidden');
      } else {
        btnOpenRec.classList.add('hidden');
      }
    }

    const recs = window.PustakaDB.getRecommendations();
    const users = window.PustakaDB.getUsers();

    container.innerHTML = recs.map(rec => {
      const book = window.PustakaDB.getBookById(rec.id_buku);
      const teacher = users.find(u => u.id_user === rec.id_user);
      if (!book) return '';

      return `
        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start hover:shadow-md transition">
          <img src="${book.sampul_gambar}" alt="${book.judul}" class="w-28 h-40 object-cover rounded-xl shadow-md border border-slate-200 shrink-0" onerror="this.src='https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'" />
          <div class="flex-1 flex flex-col justify-between h-full">
            <div>
              <div class="flex items-center justify-between gap-2 mb-2">
                <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <i class="fa-solid fa-graduation-cap mr-1"></i> Target: ${rec.target_kelas}
                </span>
                <div class="flex text-amber-400 text-xs">
                  ${'<i class="fa-solid fa-star"></i>'.repeat(rec.rating || 5)}
                </div>
              </div>
              <h3 class="font-bold text-lg text-slate-800 leading-snug mb-1">${book.judul}</h3>
              <p class="text-xs text-slate-500 mb-3">Karya: <span class="text-slate-700 font-medium">${book.pengarang}</span> (${book.tahun_terbit})</p>
              
              <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200 mb-4">
                <p class="text-xs text-slate-700 italic leading-relaxed">
                  "${rec.catatan_rekomendasi}"
                </p>
                <div class="flex items-center gap-2 mt-2 pt-2 border-t border-slate-200/60 text-xs text-slate-600">
                  <img src="${teacher ? teacher.foto_profil : 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'}" class="w-5 h-5 rounded-full object-cover" />
                  <span class="font-semibold text-slate-800">${teacher ? teacher.nama_lengkap : 'Bapak/Ibu Guru'}</span>
                  <span class="text-slate-400">• ${teacher ? teacher.kelas_jurusan : 'Pengajar'}</span>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between pt-2">
              <span class="text-xs text-slate-500">
                Stok Tersedia: <strong class="text-slate-800">${book.stok_tersedia}</strong> eksemplar
              </span>
              <button onclick="window.AppActions.openBookDetail(${book.id_buku})" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5">
                <i class="fa-solid fa-book-open"></i> Lihat & Pinjam Buku
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // ==============================================================
  // 5. DASHBOARD ANALITIK & MANAJEMEN ADMIN
  // ==============================================================
  function renderAdminDashboard() {
    const books = window.PustakaDB.getBooks();
    const trxs = window.PustakaDB.getTransactions();
    const users = window.PustakaDB.getUsers();

    // Stats Computation
    const totalTitles = books.length;
    const totalCopies = books.reduce((acc, b) => acc + (b.stok_total || 0), 0);
    const activeLoans = trxs.filter(t => t.status === 'dipinjam').length;
    const pendingBookings = trxs.filter(t => t.status === 'booking').length;
    const totalUsers = users.filter(u => u.role !== 'admin').length;
    const totalFine = trxs.reduce((acc, t) => acc + (t.denda || 0), 0);

    // Update KPI UI
    el('stat-total-books').textContent = totalTitles;
    el('stat-total-copies').textContent = `${totalCopies} Eksemplar Fisik`;
    el('stat-active-loans').textContent = activeLoans;
    el('stat-pending-bookings').textContent = `${pendingBookings} Booking Antre`;
    el('stat-total-members').textContent = totalUsers;
    el('stat-total-fines').textContent = `Rp ${totalFine.toLocaleString('id-ID')}`;

    // Render Charts
    renderCharts(books, trxs);

    // Render Admin Transactions Table
    renderAdminTransactionsTable();

    // Render Admin Book CRUD Table
    renderAdminBooksTable();
  }

  function renderCharts(books, trxs) {
    // 1. Weekly Loan Trend Chart
    const ctxTrend = el('chart-weekly-trend');
    if (ctxTrend && window.Chart) {
      if (state.analyticsChartLoan) state.analyticsChartLoan.destroy();

      state.analyticsChartLoan = new window.Chart(ctxTrend, {
        type: 'line',
        data: {
          labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
          datasets: [
            {
              label: 'Peminjaman Buku',
              data: [14, 22, 18, 29, 35, 12],
              borderColor: '#2563eb',
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              tension: 0.35,
              fill: true,
              borderWidth: 2.5
            },
            {
              label: 'Pengembalian',
              data: [8, 15, 12, 20, 28, 19],
              borderColor: '#10b981',
              backgroundColor: 'transparent',
              tension: 0.35,
              borderWidth: 2,
              borderDash: [5, 5]
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { boxWidth: 12, font: { family: 'Plus Jakarta Sans', size: 11 } } }
          },
          scales: {
            y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { font: { size: 10 } } },
            x: { grid: { display: false }, ticks: { font: { size: 10 } } }
          }
        }
      });
    }

    // 2. Category Distribution Doughnut Chart
    const ctxCat = el('chart-category-dist');
    if (ctxCat && window.Chart) {
      if (state.analyticsChartCategory) state.analyticsChartCategory.destroy();

      const categories = window.PustakaDB.getKategori();
      const labels = categories.map(c => c.nama_kategori);
      const counts = categories.map(c => books.filter(b => b.id_kategori === c.id_kategori).length);

      state.analyticsChartCategory = new window.Chart(ctxCat, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: counts,
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b'],
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 10, font: { family: 'Plus Jakarta Sans', size: 10 } } }
          },
          cutout: '68%'
        }
      });
    }
  }

  function renderAdminTransactionsTable() {
    const tableBody = el('admin-transactions-tbody');
    if (!tableBody) return;

    const trxs = window.PustakaDB.getTransactions();
    const users = window.PustakaDB.getUsers();

    tableBody.innerHTML = trxs.map(trx => {
      const book = window.PustakaDB.getBookById(trx.id_buku) || { judul: 'Buku Tidak Ada' };
      const user = users.find(u => u.id_user === trx.id_user) || { nama_lengkap: 'Siswa', nis_nip: '-' };

      let statusPill = '';
      let actionButtons = '';

      if (trx.status === 'booking') {
        statusPill = `<span class="px-2.5 py-1 rounded-full text-[11px] font-semibold badge-booking">Menunggu Konfirmasi</span>`;
        actionButtons = `
          <button onclick="window.AppActions.approveLoan(${trx.id_transaksi})" class="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition" title="Verifikasi Pengambilan Buku">
            <i class="fa-solid fa-check mr-1"></i> Setujui Pinjam
          </button>
        `;
      } else if (trx.status === 'dipinjam') {
        const isLate = trx.denda > 0;
        statusPill = isLate 
          ? `<span class="px-2.5 py-1 rounded-full text-[11px] font-semibold badge-borrowed">Terlambat (+Rp ${trx.denda.toLocaleString('id-ID')})</span>`
          : `<span class="px-2.5 py-1 rounded-full text-[11px] font-semibold badge-available">Aktif Dipinjam</span>`;
        actionButtons = `
          <button onclick="window.AppActions.processReturn(${trx.id_transaksi})" class="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition" title="Terima Pengembalian Buku">
            <i class="fa-solid fa-arrow-rotate-left mr-1"></i> Proses Kembali
          </button>
        `;
      } else if (trx.status === 'dikembalikan') {
        statusPill = `<span class="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">Selesai Dikembalikan</span>`;
        actionButtons = `<span class="text-xs text-slate-400"><i class="fa-solid fa-circle-check text-emerald-500"></i> Lengkap</span>`;
      } else {
        statusPill = `<span class="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-400">Dibatalkan</span>`;
        actionButtons = `<span class="text-xs text-slate-400">-</span>`;
      }

      return `
        <tr class="hover:bg-slate-50 border-b border-slate-100 transition">
          <td class="px-4 py-3 font-mono font-semibold text-xs text-slate-700">${trx.kode_transaksi}</td>
          <td class="px-4 py-3">
            <div class="font-semibold text-xs text-slate-800">${user.nama_lengkap}</div>
            <div class="text-[11px] text-slate-400 font-mono">${user.nis_nip} (${user.role})</div>
          </td>
          <td class="px-4 py-3">
            <div class="font-medium text-xs text-slate-800 line-clamp-1">${book.judul}</div>
            <div class="text-[11px] text-slate-400">Penulis: ${book.pengarang}</div>
          </td>
          <td class="px-4 py-3 text-xs text-slate-600">
            ${trx.tgl_pinjam || '<span class="italic text-slate-400">Belum diambil</span>'}
          </td>
          <td class="px-4 py-3 text-xs font-semibold ${trx.denda > 0 ? 'text-rose-600' : 'text-slate-700'}">
            ${trx.tenggat_kembali || '<span class="italic text-slate-400">Hold 24 Jam</span>'}
          </td>
          <td class="px-4 py-3">${statusPill}</td>
          <td class="px-4 py-3 text-right">${actionButtons}</td>
        </tr>
      `;
    }).join('');
  }

  function renderAdminBooksTable() {
    const tableBody = el('admin-books-tbody');
    if (!tableBody) return;

    const books = window.PustakaDB.getBooks();
    const categories = window.PustakaDB.getKategori();
    const raks = window.PustakaDB.getRak();

    tableBody.innerHTML = books.map(book => {
      const cat = categories.find(c => c.id_kategori === book.id_kategori);
      const rak = raks.find(r => r.id_rak === book.id_rak);

      return `
        <tr class="hover:bg-slate-50 border-b border-slate-100 transition">
          <td class="px-4 py-3">
            <div class="flex items-center gap-3">
              <img src="${book.sampul_gambar}" alt="${book.judul}" class="w-10 h-14 object-cover rounded shadow-sm border border-slate-200 shrink-0" onerror="this.src='https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'" />
              <div>
                <div class="font-bold text-xs text-slate-800 line-clamp-1">${book.judul}</div>
                <div class="text-[11px] text-slate-500 font-mono">ISBN: ${book.isbn}</div>
                <div class="text-[11px] text-blue-600">${cat ? cat.nama_kategori : '-'}</div>
              </div>
            </div>
          </td>
          <td class="px-4 py-3 text-xs text-slate-600">
            <div>${book.pengarang}</div>
            <div class="text-[11px] text-slate-400">${book.penerbit} (${book.tahun_terbit})</div>
          </td>
          <td class="px-4 py-3 text-xs font-medium text-slate-700">
            <span class="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
              <i class="fa-solid fa-location-dot text-slate-400 mr-1"></i> ${rak ? rak.nama_rak : 'Rak 01'}
            </span>
          </td>
          <td class="px-4 py-3 text-center">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${book.stok_tersedia > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}">
              ${book.stok_tersedia} / ${book.stok_total}
            </span>
          </td>
          <td class="px-4 py-3 text-right">
            <div class="flex items-center justify-end gap-1.5">
              <button onclick="window.AppActions.editBookFromAdmin(${book.id_buku})" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit Data Buku">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button onclick="window.AppActions.deleteBookFromAdmin(${book.id_buku})" class="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition" title="Hapus Buku">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Populate Select Options for Book Form
  function populateSelectOptions() {
    const catSelect = el('form-book-category');
    const rakSelect = el('form-book-rak');
    const categories = window.PustakaDB.getKategori();
    const raks = window.PustakaDB.getRak();

    if (catSelect) {
      catSelect.innerHTML = categories.map(c => `
        <option value="${c.id_kategori}">${c.nama_kategori}</option>
      `).join('');
    }

    if (rakSelect) {
      rakSelect.innerHTML = raks.map(r => `
        <option value="${r.id_rak}">${r.kode_rak} - ${r.nama_rak} (${r.lokasi})</option>
      `).join('');
    }
  }

  function populateRecBookSelect() {
    const select = el('rec-select-book');
    const books = window.PustakaDB.getBooks();
    if (select) {
      select.innerHTML = books.map(b => `
        <option value="${b.id_buku}">${b.judul} (${b.pengarang})</option>
      `).join('');
    }
  }

  function saveBookFromForm() {
    const id = el('form-book-id').value;
    const bookData = {
      judul: el('form-book-title').value.trim(),
      pengarang: el('form-book-author').value.trim(),
      penerbit: el('form-book-publisher').value.trim(),
      tahun_terbit: parseInt(el('form-book-year').value, 10),
      isbn: el('form-book-isbn').value.trim(),
      id_kategori: parseInt(el('form-book-category').value, 10),
      id_rak: parseInt(el('form-book-rak').value, 10),
      stok_total: parseInt(el('form-book-stock').value, 10),
      stok_tersedia: parseInt(el('form-book-stock').value, 10),
      halaman: parseInt(el('form-book-pages').value, 10) || 300,
      sampul_gambar: el('form-book-cover').value.trim() || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
      deskripsi: el('form-book-desc').value.trim()
    };

    if (id) {
      window.PustakaDB.updateBook(id, bookData);
      showToast('Data buku berhasil diperbarui!', 'success');
    } else {
      window.PustakaDB.addBook(bookData);
      showToast('Buku baru berhasil ditambahkan ke katalog!', 'success');
    }

    el('modal-add-edit-book').classList.add('hidden');
    renderKatalog();
    renderAdminDashboard();
  }

  function editBookFromAdmin(idBuku) {
    const book = window.PustakaDB.getBookById(idBuku);
    if (!book) return;

    populateSelectOptions();
    el('modal-book-detail').classList.add('hidden');

    el('form-book-id').value = book.id_buku;
    el('form-book-title').value = book.judul;
    el('form-book-author').value = book.pengarang;
    el('form-book-publisher').value = book.penerbit;
    el('form-book-year').value = book.tahun_terbit;
    el('form-book-isbn').value = book.isbn;
    el('form-book-category').value = book.id_kategori;
    el('form-book-rak').value = book.id_rak;
    el('form-book-stock').value = book.stok_total;
    el('form-book-pages').value = book.halaman || 350;
    el('form-book-cover').value = book.sampul_gambar;
    el('form-book-desc').value = book.deskripsi;

    el('modal-book-title-heading').textContent = 'Perbarui Data Buku';
    el('modal-add-edit-book').classList.remove('hidden');
  }

  function deleteBookFromAdmin(idBuku) {
    const book = window.PustakaDB.getBookById(idBuku);
    if (!book) return;

    if (confirm(`Apakah Anda yakin ingin menghapus buku "${book.judul}" dari koleksi?`)) {
      window.PustakaDB.deleteBook(idBuku);
      showToast('Buku berhasil dihapus dari sistem.', 'info');
      renderKatalog();
      renderAdminDashboard();
    }
  }

  // ==============================================================
  // 6. NOTIFIKASI PENGINGAT SISTEM
  // ==============================================================
  function renderNotifications() {
    const notifs = window.PustakaDB.getNotifications(state.currentUser.id_user);
    const unread = notifs.filter(n => !n.is_read);
    const countBadge = el('nav-notif-count');

    if (countBadge) {
      if (unread.length > 0) {
        countBadge.textContent = unread.length;
        countBadge.classList.remove('hidden');
      } else {
        countBadge.classList.add('hidden');
      }
    }
  }

  function renderNotificationsList() {
    const list = el('notification-list-container');
    if (!list) return;

    const notifs = window.PustakaDB.getNotifications(state.currentUser.id_user);
    if (notifs.length === 0) {
      list.innerHTML = `
        <div class="p-8 text-center text-slate-400">
          <i class="fa-regular fa-bell-slash text-3xl mb-2"></i>
          <p class="text-sm">Belum ada notifikasi atau pengingat untuk Anda.</p>
        </div>
      `;
      return;
    }

    list.innerHTML = notifs.map(n => {
      let iconColor = 'bg-blue-100 text-blue-600';
      let iconClass = 'fa-solid fa-bell';

      if (n.tipe === 'pengingat_tenggat') {
        iconColor = 'bg-amber-100 text-amber-600';
        iconClass = 'fa-solid fa-clock-rotate-left';
      } else if (n.tipe === 'denda') {
        iconColor = 'bg-rose-100 text-rose-600';
        iconClass = 'fa-solid fa-triangle-exclamation';
      } else if (n.tipe === 'konfirmasi_booking') {
        iconColor = 'bg-emerald-100 text-emerald-600';
        iconClass = 'fa-solid fa-circle-check';
      }

      return `
        <div class="p-4 border-b border-slate-100 hover:bg-slate-50 transition flex items-start gap-3 ${!n.is_read ? 'bg-blue-50/40' : ''}">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconColor}">
            <i class="${iconClass}"></i>
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between mb-1">
              <h5 class="font-bold text-xs text-slate-800">${n.judul}</h5>
              <span class="text-[10px] text-slate-400">${n.waktu || 'Terkini'}</span>
            </div>
            <p class="text-xs text-slate-600 leading-relaxed">${n.pesan}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  // ==============================================================
  // 7. PROFIL PENGGUNA
  // ==============================================================
  function renderProfil() {
    const user = state.currentUser;
    el('profile-display-name').textContent = user.nama_lengkap;
    el('profile-display-role').textContent = user.role.toUpperCase();
    el('profile-display-id').textContent = user.nis_nip;
    el('profile-avatar-img').src = user.foto_profil;

    el('profile-input-name').value = user.nama_lengkap;
    el('profile-input-id').value = user.nis_nip;
    el('profile-input-email').value = user.email;
    el('profile-input-phone').value = user.no_telepon || '08123456789';
    el('profile-input-dept').value = user.kelas_jurusan || '-';

    // Activity summary
    const trxs = window.PustakaDB.getTransactions().filter(t => t.id_user === user.id_user);
    el('profile-stat-total-borrowed').textContent = trxs.length;
    const returned = trxs.filter(t => t.status === 'dikembalikan').length;
    el('profile-stat-returned').textContent = returned;
    const active = trxs.filter(t => ['booking', 'dipinjam'].includes(t.status)).length;
    el('profile-stat-active').textContent = active;
  }

  // ==============================================================
  // 8. TOAST NOTIFICATION UTILITY
  // ==============================================================
  function showToast(message, type = 'info') {
    const container = el('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    let bg = 'bg-slate-800 text-white';
    let icon = 'fa-solid fa-info-circle text-blue-400';

    if (type === 'success') {
      bg = 'bg-emerald-900 text-emerald-50 border border-emerald-700';
      icon = 'fa-solid fa-circle-check text-emerald-400';
    } else if (type === 'warning') {
      bg = 'bg-amber-900 text-amber-50 border border-amber-700';
      icon = 'fa-solid fa-triangle-exclamation text-amber-400';
    } else if (type === 'error') {
      bg = 'bg-rose-900 text-rose-50 border border-rose-700';
      icon = 'fa-solid fa-circle-xmark text-rose-400';
    }

    toast.className = `flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-xs font-medium animate-fade-in ${bg}`;
    toast.innerHTML = `<i class="${icon} text-base shrink-0"></i> <span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // Expose Global Actions to window for inline onclicks
  window.AppActions = {
    openBookDetail,
    handleBookingFromModal: (id) => handleBooking(id),
    handleQuickBooking: (id) => handleBooking(id),
    approveLoan: (idTrx) => {
      window.PustakaDB.approveLoan(idTrx);
      showToast('Peminjaman telah disetujui & buku diserahkan ke siswa!', 'success');
      renderAdminDashboard();
    },
    processReturn: (idTrx) => {
      window.PustakaDB.returnBook(idTrx);
      showToast('Buku telah berhasil dikembalikan ke rak fisik perpustakaan!', 'success');
      renderAdminDashboard();
    },
    cancelBooking: (idTrx) => {
      if (confirm('Yakin ingin membatalkan booking buku ini?')) {
        window.PustakaDB.cancelBooking(idTrx);
        showToast('Pemesanan buku telah dibatalkan.', 'info');
        renderPeminjamanSaya();
        renderKatalog();
      }
    },
    editBookFromAdmin,
    deleteBookFromAdmin,
    switchTab
  };

  // Launch app
  initApp();
});


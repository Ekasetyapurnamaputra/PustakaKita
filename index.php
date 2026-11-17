<?php
session_start();
if (!isset($_SESSION['user'])): ?>
<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Login | PustakaKita</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    body { font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
    .book-pattern { background-image: radial-gradient(rgba(255,255,255,.12) 1px, transparent 1px); background-size: 22px 22px; }
    .blob { filter: blur(2px); animation: float 7s ease-in-out infinite; }
    @keyframes float { 50% { transform: translate(12px,-14px) scale(1.04); } }
  </style>
</head>
<body class="min-h-screen bg-slate-100 text-slate-800">
  <main class="min-h-screen flex items-center justify-center p-4 sm:p-6">
    <div class="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-300/50 lg:grid lg:grid-cols-2">
      <section class="relative hidden min-h-[650px] overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between book-pattern">
        <div class="blob absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-400/30"></div>
        <div class="blob absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-indigo-400/20" style="animation-delay:1.5s"></div>
        <div class="relative z-10">
          <div class="mb-16 flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-2xl ring-1 ring-white/25"><i class="fa-solid fa-book-bookmark"></i></div>
            <div><div class="text-xl font-extrabold">Pustaka<span class="text-blue-200">Kita</span></div><div class="text-[10px] uppercase tracking-[.2em] text-blue-200">Perpustakaan Digital</div></div>
          </div>
          <span class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100"><i class="fa-solid fa-sparkles text-amber-300"></i> Akses lebih mudah</span>
          <h1 class="mt-5 text-4xl font-black leading-tight">Temukan ilmu,<br><span class="text-blue-200">tumbuhkan inspirasi.</span></h1>
          <p class="mt-5 max-w-sm text-sm leading-7 text-blue-100/80">Kelola peminjaman, jelajahi koleksi buku, dan dapatkan rekomendasi terbaik dari perpustakaan sekolah.</p>
        </div>
        <div class="relative z-10 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm"><div class="flex items-center gap-3"><div class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-amber-950"><i class="fa-solid fa-quote-left"></i></div><p class="text-xs leading-5 text-blue-50">“Membaca adalah jendela untuk melihat dunia.”</p></div></div>
      </section>
      <section class="flex min-h-[650px] items-center p-6 sm:p-10 lg:p-14">
        <div class="w-full max-w-md mx-auto">
          <div class="mb-8 lg:hidden"><div class="flex items-center gap-3"><div class="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl text-white"><i class="fa-solid fa-book-bookmark"></i></div><div class="text-xl font-extrabold">Pustaka<span class="text-blue-600">Kita</span></div></div></div>
          <div class="mb-8"><p class="mb-2 text-sm font-semibold text-blue-600">Selamat datang kembali!</p><h2 class="text-3xl font-black tracking-tight text-slate-900">Masuk ke akun Anda</h2><p class="mt-2 text-sm text-slate-500">Gunakan email atau NIS/NIP untuk melanjutkan.</p></div>
          <?php if (isset($_GET['error'])): ?><div class="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700"><i class="fa-solid fa-circle-exclamation mt-0.5"></i><span><?=htmlspecialchars($_GET['error'])?></span></div><?php endif; ?>
          <form method="post" action="auth/login.php" class="space-y-5" id="login-form">
            <div><label for="identifier" class="mb-2 block text-sm font-bold text-slate-700">Email atau NIS/NIP</label><div class="relative"><i class="fa-regular fa-user pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i><input id="identifier" name="identifier" type="text" autocomplete="username" required autofocus placeholder="contoh@email.com" class="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"></div></div>
            <div><div class="mb-2 flex items-center justify-between"><label for="password" class="block text-sm font-bold text-slate-700">Password</label></div><div class="relative"><i class="fa-solid fa-lock pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i><input id="password" name="password" type="password" autocomplete="current-password" required placeholder="Masukkan password" class="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"><button type="button" id="toggle-password" aria-label="Tampilkan password" class="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700"><i class="fa-regular fa-eye"></i></button></div></div>
            <button id="login-button" type="submit" class="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-blue-600/30 focus:outline-none focus:ring-4 focus:ring-blue-200"><span>Masuk ke PustakaKita</span><i class="fa-solid fa-arrow-right"></i></button>
          </form>
          <div class="my-7 flex items-center gap-3"><div class="h-px flex-1 bg-slate-200"></div><span class="text-xs text-slate-400">Akun demo</span><div class="h-px flex-1 bg-slate-200"></div></div><p class="text-center text-xs leading-5 text-slate-500">Password awal seluruh akun: <span class="rounded bg-slate-100 px-1.5 py-1 font-bold text-slate-700">password</span></p><p class="mt-8 text-center text-xs text-slate-400">© <?=date('Y')?> PustakaKita · Sistem Perpustakaan Sekolah</p>
        </div>
      </section>
    </div>
  </main>
  <script>
    const toggle = document.getElementById('toggle-password'), password = document.getElementById('password');
    toggle.addEventListener('click', () => { const visible = password.type === 'text'; password.type = visible ? 'password' : 'text'; toggle.innerHTML = visible ? '<i class="fa-regular fa-eye"></i>' : '<i class="fa-regular fa-eye-slash"></i>'; toggle.setAttribute('aria-label', visible ? 'Tampilkan password' : 'Sembunyikan password'); });
    document.getElementById('login-form').addEventListener('submit', () => { const button = document.getElementById('login-button'); button.disabled = true; button.classList.add('opacity-75'); button.querySelector('span').textContent = 'Memproses...'; button.querySelector('i').className = 'fa-solid fa-spinner fa-spin'; });
  </script>
</body>
</html>
<?php exit; endif; require __DIR__ . '/app.php';

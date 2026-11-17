<?php
session_start();
require_once __DIR__ . '/../config/koneksi.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header('Location: ../index.php'); exit; }
$identifier = trim($_POST['identifier'] ?? '');
$password = $_POST['password'] ?? '';
// Gunakan dua placeholder berbeda karena PDO MySQL tidak selalu mengizinkan
// satu named parameter dipakai lebih dari sekali pada prepared statement.
$stmt = $pdo->prepare('SELECT * FROM users WHERE (email = :email OR nis_nip = :nis_nip) AND status_aktif = "aktif" LIMIT 1');
$stmt->execute(['email' => $identifier, 'nis_nip' => $identifier]);
$user = $stmt->fetch();
if (!$user || !password_verify($password, $user['password'])) {
  header('Location: ../index.php?error=' . urlencode('Email/NIS/NIP atau password salah.')); exit;
}
$_SESSION['user'] = ['id_user'=>$user['id_user'], 'nama_lengkap'=>$user['nama_lengkap'], 'email'=>$user['email'], 'role'=>$user['role'], 'foto_profil'=>$user['foto_profil']];
header('Location: ../index.php'); exit;

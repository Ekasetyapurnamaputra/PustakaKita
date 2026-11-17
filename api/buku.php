<?php
require_once __DIR__ . '/guard.php';
require_once __DIR__ . '/../config/koneksi.php';
$user = require_login();
header('Content-Type: application/json; charset=utf-8');
$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'GET') {
  $q = trim($_GET['q'] ?? '');
  $stmt = $pdo->prepare('SELECT b.*, k.nama_kategori, r.kode_rak FROM buku b JOIN kategori k ON k.id_kategori=b.id_kategori JOIN rak r ON r.id_rak=b.id_rak WHERE b.judul LIKE :q OR b.pengarang LIKE :q OR b.isbn LIKE :q ORDER BY b.populer_count DESC');
  $stmt->execute(['q'=>"%$q%"]); echo json_encode(['success'=>true,'data'=>$stmt->fetchAll()]); exit;
}
if ($user['role'] !== 'admin') { http_response_code(403); echo json_encode(['success'=>false,'message'=>'Hanya admin yang dapat mengubah buku.']); exit; }
$data = json_decode(file_get_contents('php://input'), true) ?: $_POST;
if ($method === 'POST') { $s=$pdo->prepare('INSERT INTO buku (isbn,judul,pengarang,penerbit,tahun_terbit,id_kategori,id_rak,stok_total,stok_tersedia,deskripsi) VALUES (?,?,?,?,?,?,?,?,?,?)'); $s->execute([$data['isbn'],$data['judul'],$data['pengarang'],$data['penerbit'],$data['tahun_terbit'],$data['id_kategori'],$data['id_rak'],$data['stok_total'],$data['stok_total'],$data['deskripsi']??null]); echo json_encode(['success'=>true]); exit; }
http_response_code(405); echo json_encode(['success'=>false,'message'=>'Method tidak didukung']);

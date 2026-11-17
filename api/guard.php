<?php
session_start();
function require_login(): array {
  if (!isset($_SESSION['user'])) { http_response_code(401); header('Content-Type: application/json'); echo json_encode(['success'=>false,'message'=>'Akses ditolak. Silakan login.']); exit; }
  return $_SESSION['user'];
}
function require_role(array $roles): array {
  $user = require_login();
  if (!in_array($user['role'], $roles, true)) { http_response_code(403); header('Content-Type: application/json'); echo json_encode(['success'=>false,'message'=>'Anda tidak memiliki hak akses.']); exit; }
  return $user;
}

<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
if (!isset($_SESSION['user'])) { http_response_code(401); echo json_encode(['success'=>false,'message'=>'Belum login']); exit; }
echo json_encode(['success'=>true,'user'=>$_SESSION['user']]);

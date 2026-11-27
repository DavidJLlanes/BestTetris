<?php
/** Responde en JSON con cabeceras de seguridad y termina. */
function bt_send_json(int $status, array $body): void {
  http_response_code($status);
  header('Content-Type: application/json; charset=utf-8');
  header('Cache-Control: no-store');
  header('X-Content-Type-Options: nosniff');
  header('Referrer-Policy: no-referrer');
  header("Content-Security-Policy: default-src 'none'; frame-ancestors 'none'");
  echo json_encode($body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
  exit;
}

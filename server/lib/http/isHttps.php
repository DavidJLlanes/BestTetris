<?php
/** La petición llega cifrada (directamente o tras un proxy local que lo indica). */
function bt_is_https(): bool {
  if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') return true;
  return ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https' && bt_is_local_addr($_SERVER['REMOTE_ADDR'] ?? '');
}

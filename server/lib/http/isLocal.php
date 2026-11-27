<?php
/** Pruebas en el propio ordenador (localhost): se permite sin HTTPS. */
function bt_is_local(): bool {
  return in_array(bt_host(), ['localhost', '127.0.0.1'], true) && bt_is_local_addr($_SERVER['REMOTE_ADDR'] ?? '');
}

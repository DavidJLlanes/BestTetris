<?php
/** Dirección de la propia máquina. */
function bt_is_local_addr(string $ip): bool {
  return $ip === '127.0.0.1' || $ip === '::1';
}

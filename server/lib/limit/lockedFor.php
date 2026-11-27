<?php
/** Segundos que le quedan de bloqueo a una clave (usuario o dirección); 0 si puede intentarlo. */
function bt_locked_for(string $key, int $max): int {
  $entry = bt_read_json('intentos.json')[$key] ?? null;
  if (!$entry || ($entry['n'] ?? 0) < $max) return 0;
  return max(0, (int) $entry['since'] + BT_LIMIT_WINDOW - time());
}

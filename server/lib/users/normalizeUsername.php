<?php
/** Nombre de usuario en minúsculas y sin espacios; null si no es válido. */
function bt_normalize_username(string $name): ?string {
  $n = strtolower(trim($name));
  return preg_match(BT_USERNAME, $n) ? $n : null;
}

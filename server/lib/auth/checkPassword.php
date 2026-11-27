<?php
/**
 * Comprueba usuario y contraseña. Si el usuario no existe se compara igualmente contra un hash
 * de relleno, para que el tiempo de respuesta no delate qué usuarios existen.
 */
function bt_check_password(string $username, string $password): bool {
  static $dummy = null;
  $user = bt_find_user($username);
  if (!$user) { $dummy = $dummy ?? bt_hash_password(bin2hex(random_bytes(8))); password_verify($password, $dummy); return false; }
  if (!password_verify($password, (string) $user['hash'])) return false;
  if (bt_needs_rehash((string) $user['hash'])) bt_save_user($username, ['hash' => bt_hash_password($password)] + $user);
  return true;
}

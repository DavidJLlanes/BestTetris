<?php
/** El hash guardado es de un algoritmo más flojo que el actual. */
function bt_needs_rehash(string $hash): bool {
  return defined('PASSWORD_ARGON2ID')
    ? password_needs_rehash($hash, PASSWORD_ARGON2ID)
    : password_needs_rehash($hash, PASSWORD_BCRYPT, ['cost' => 12]);
}

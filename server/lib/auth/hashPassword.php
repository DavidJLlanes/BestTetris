<?php
/** Hash fuerte de la contraseña: Argon2id si PHP lo trae; si no, bcrypt con coste 12. */
function bt_hash_password(string $password): string {
  return defined('PASSWORD_ARGON2ID')
    ? password_hash($password, PASSWORD_ARGON2ID)
    : password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
}

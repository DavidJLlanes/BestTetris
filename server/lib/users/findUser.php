<?php
/** Datos guardados de un usuario o null si no existe. */
function bt_find_user(string $username): ?array {
  $users = bt_read_json('users.json');
  return isset($users[$username]) && is_array($users[$username]) ? $users[$username] : null;
}

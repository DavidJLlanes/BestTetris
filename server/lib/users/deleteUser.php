<?php
/** Borra un usuario, sus sesiones y su progreso guardado. Devuelve false si no existía. */
function bt_delete_user(string $username): bool {
  $existed = bt_with_json('users.json', function (array &$users) use ($username) {
    if (!isset($users[$username])) return false;
    unset($users[$username]);
    return true;
  });
  bt_with_json('sessions.json', function (array &$s) use ($username) {
    foreach ($s as $k => $v) if (($v['user'] ?? '') === $username) unset($s[$k]);
  });
  foreach (['', '.anterior'] as $suffix) @unlink(bt_data_path("progreso/$username$suffix.json"));
  return $existed;
}

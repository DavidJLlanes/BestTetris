<?php
/** Cambia el nombre de un usuario conservando contraseña, progreso y sesiones abiertas. */
function bt_rename_user(string $old, string $new, string $display): void {
  bt_with_json('users.json', function (array &$users) use ($old, $new, $display) {
    $user = $users[$old];
    unset($users[$old]);
    $users[$new] = ['display' => $display] + $user;
  });
  if ($old !== $new) foreach ([false, true] as $prev) {
    $from = bt_data_path(bt_save_path($old, $prev));
    if (is_file($from)) rename($from, bt_data_path(bt_save_path($new, $prev)));
  }
  bt_with_json('sessions.json', function (array &$s) use ($old, $new) {
    foreach ($s as $k => $v) if (($v['user'] ?? '') === $old) $s[$k]['user'] = $new;
  });
}

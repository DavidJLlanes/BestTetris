<?php
/** Crea o actualiza un usuario (solo desde la línea de comandos o al mejorar el hash). */
function bt_save_user(string $username, array $user): void {
  bt_with_json('users.json', function (array &$users) use ($username, $user) { $users[$username] = $user; });
}

<?php
/** Usuario de la sesión o respuesta 401 si no hay sesión válida. */
function bt_require_user(): string {
  $user = bt_current_user();
  if ($user === null) bt_send_json(401, ['error' => 'Inicia sesión otra vez']);
  return $user;
}

<?php
/** Nombre de usuario tal como se escribió al crearlo (p. ej. "DavidJLlanes"); para entrar no importan las mayúsculas. */
function bt_display_name(string $username): string {
  $user = bt_find_user($username);
  return (string) ($user['display'] ?? $username);
}

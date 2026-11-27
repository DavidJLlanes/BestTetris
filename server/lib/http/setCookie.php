<?php
/** Pone (o borra, con $value vacío) la cookie de sesión: solo HTTPS, invisible para JavaScript y sin envíos desde otras webs. */
function bt_set_cookie(string $value, int $expires): void {
  setcookie(BT_COOKIE, $value, [
    'expires' => $expires, 'path' => bt_cookie_path(), 'secure' => !bt_is_local(),
    'httponly' => true, 'samesite' => 'Strict',
  ]);
}

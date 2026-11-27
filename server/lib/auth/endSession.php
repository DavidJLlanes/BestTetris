<?php
/** Cierra la sesión de esta petición y borra la cookie. */
function bt_end_session(): void {
  $token = (string) ($_COOKIE[BT_COOKIE] ?? '');
  if ($token !== '') {
    $key = bt_token_key($token);
    bt_with_json('sessions.json', function (array &$s) use ($key) { unset($s[$key]); });
  }
  bt_set_cookie('', time() - 3600);
}

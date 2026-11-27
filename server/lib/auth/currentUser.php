<?php
/** Usuario de la sesión de esta petición o null. Alarga la sesión si le queda poco. */
function bt_current_user(): ?string {
  $token = (string) ($_COOKIE[BT_COOKIE] ?? '');
  if (!preg_match('/^[a-f0-9]{64}$/', $token)) return null;
  $key = bt_token_key($token);
  $session = bt_read_json('sessions.json')[$key] ?? null;
  if (!$session || ($session['exp'] ?? 0) < time() || !bt_find_user((string) $session['user'])) return null;
  if ($session['exp'] - time() < BT_SESSION_RENEW_DAYS * 86400) {
    $exp = time() + BT_SESSION_DAYS * 86400;
    bt_with_json('sessions.json', function (array &$s) use ($key, $exp) { if (isset($s[$key])) $s[$key]['exp'] = $exp; });
    bt_set_cookie($token, $exp);
  }
  return (string) $session['user'];
}

<?php
/** Abre una sesión nueva para el usuario (token aleatorio de 256 bits) y pone la cookie. */
function bt_start_session(string $username): void {
  $token = bin2hex(random_bytes(32));
  $exp = time() + BT_SESSION_DAYS * 86400;
  bt_with_json('sessions.json', function (array &$s) use ($token, $username, $exp) {
    foreach ($s as $k => $v) if (($v['exp'] ?? 0) < time()) unset($s[$k]); // limpia las caducadas
    $s[bt_token_key($token)] = ['user' => $username, 'exp' => $exp, 'created' => time()];
  });
  bt_set_cookie($token, $exp);
}

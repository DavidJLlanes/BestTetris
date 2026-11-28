<?php
/** POST {usuario, clave} → abre sesión. Con límite de intentos por usuario y por dirección. */
require __DIR__ . '/../server/bootstrap.php';
bt_guard_request(['POST']);
$body = bt_read_body();
$username = bt_normalize_username((string) ($body->usuario ?? ''));
$password = (string) ($body->clave ?? '');
$ipKey = 'ip:' . bt_client_ip();
$userKey = 'user:' . ($username ?? '-');
$wait = max(bt_locked_for($ipKey, BT_LIMIT_IP), bt_locked_for($userKey, BT_LIMIT_USER));
if ($wait > 0) bt_send_json(429, ['error' => 'Demasiados intentos. Prueba dentro de ' . ceil($wait / 60) . ' min.', 'espera' => $wait]);
if ($username === null || strlen($password) > 1024 || !bt_check_password($username, $password)) {
  bt_record_failure($ipKey, $userKey);
  usleep(random_int(200000, 400000)); // frena a quien prueba contraseñas a toda velocidad
  bt_send_json(401, ['error' => 'Usuario o contraseña incorrectos']);
}
bt_clear_failures($userKey);
bt_start_session($username);
bt_send_json(200, ['usuario' => bt_display_name($username)]);

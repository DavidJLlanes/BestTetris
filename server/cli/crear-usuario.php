<?php
/**
 * Crea un usuario o le cambia la contraseña. El registro está cerrado: es la única forma de dar de alta.
 * Uso (en la carpeta del juego):  sudo -u www-data php server/cli/crear-usuario.php NOMBRE
 */
require __DIR__ . '/../bootstrap.php';
bt_require_cli();
$username = bt_normalize_username((string) ($argv[1] ?? ''));
if ($username === null) { fwrite(STDERR, "Uso: php server/cli/crear-usuario.php NOMBRE (3-32 letras minúsculas, números, _ . -)\n"); exit(1); }
$existing = bt_find_user($username);
$p1 = bt_ask_password(($existing ? 'Nueva contraseña' : 'Contraseña') . " para $username: ");
if (strlen($p1) < 8) { fwrite(STDERR, "La contraseña debe tener al menos 8 caracteres.\n"); exit(1); }
if (bt_ask_password('Repítela: ') !== $p1) { fwrite(STDERR, "No coinciden. No se ha cambiado nada.\n"); exit(1); }
bt_save_user($username, ['hash' => bt_hash_password($p1), 'created' => $existing['created'] ?? time()]);
if ($existing) bt_with_json('sessions.json', function (array &$s) use ($username) {
  foreach ($s as $k => $v) if (($v['user'] ?? '') === $username) unset($s[$k]); // cierra las sesiones viejas
});
echo ($existing ? "Contraseña cambiada para $username (se han cerrado sus sesiones)." : "Usuario $username creado.") . PHP_EOL;
echo 'Datos en ' . BT_DATA_DIR . PHP_EOL;

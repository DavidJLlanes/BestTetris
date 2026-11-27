<?php
/**
 * Borra un usuario, sus sesiones y su progreso en el servidor (los dispositivos conservan su copia local).
 * Uso:  sudo -u www-data php server/cli/borrar-usuario.php NOMBRE
 */
require __DIR__ . '/../bootstrap.php';
bt_require_cli();
$username = bt_normalize_username((string) ($argv[1] ?? ''));
if ($username === null) { fwrite(STDERR, "Uso: php server/cli/borrar-usuario.php NOMBRE\n"); exit(1); }
fwrite(STDOUT, "Escribe $username para confirmar el borrado: ");
if (trim((string) fgets(STDIN)) !== $username) { echo "Cancelado.\n"; exit(1); }
echo (bt_delete_user($username) ? "Usuario $username borrado." : "No existe el usuario $username.") . PHP_EOL;

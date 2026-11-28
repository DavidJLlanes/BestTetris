<?php
/**
 * Cambia el nombre de un usuario sin tocar su contraseña ni su progreso. Las sesiones abiertas siguen valiendo.
 * Uso:  sudo -u www-data php server/cli/renombrar-usuario.php ACTUAL NUEVO
 * Para entrar no importan las mayúsculas; se muestran tal como escribas NUEVO.
 */
require __DIR__ . '/../bootstrap.php';
bt_require_cli();
$old = bt_normalize_username((string) ($argv[1] ?? ''));
$display = trim((string) ($argv[2] ?? ''));
$new = bt_normalize_username($display);
if ($old === null || $new === null || !bt_valid_display($display, $new)) { fwrite(STDERR, "Uso: php server/cli/renombrar-usuario.php ACTUAL NUEVO (3-32 letras, números, _ . -)\n"); exit(1); }
if (!bt_find_user($old)) { fwrite(STDERR, "No existe el usuario $old.\n"); exit(1); }
if ($new !== $old && bt_find_user($new)) { fwrite(STDERR, "Ya existe un usuario $new.\n"); exit(1); }
bt_rename_user($old, $new, $display);
echo "Usuario $old renombrado a $display. Contraseña y progreso intactos." . PHP_EOL;

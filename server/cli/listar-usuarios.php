<?php
/** Lista los usuarios y cuándo se guardó su progreso por última vez. Uso: sudo -u www-data php server/cli/listar-usuarios.php */
require __DIR__ . '/../bootstrap.php';
bt_require_cli();
$users = bt_read_json('users.json');
if (!$users) { echo "No hay usuarios todavía.\n"; exit; }
foreach ($users as $name => $u) {
  $d = bt_read_json(bt_save_path($name));
  $when = isset($d['updated']) ? date('Y-m-d H:i', (int) $d['updated']) : 'nunca';
  printf("%-24s creado %s · progreso guardado: %s (versión %d)\n", $name, date('Y-m-d', (int) ($u['created'] ?? 0)), $when, (int) ($d['rev'] ?? 0));
}

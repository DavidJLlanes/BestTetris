<?php
/** Progreso guardado del usuario: ['rev' => n, 'save' => copia (objeto) o null]. */
function bt_load_save(string $username): array {
  $d = bt_read_json(bt_save_path($username));
  $save = isset($d['save']) ? json_decode((string) $d['save'], false) : null;
  return ['rev' => (int) ($d['rev'] ?? 0), 'save' => $save];
}

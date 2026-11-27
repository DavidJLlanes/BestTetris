<?php
/**
 * Guarda el progreso solo si el dispositivo partía de la última versión ($baseRev).
 * Si otro dispositivo guardó antes, devuelve la versión del servidor para que el juego las fusione.
 * La copia va como texto JSON tal cual, y se conserva la versión anterior como respaldo.
 */
function bt_store_save(string $username, int $baseRev, string $saveJson): array {
  $done = bt_with_json(bt_save_path($username), function (array &$d) use ($username, $baseRev, $saveJson) {
    $rev = (int) ($d['rev'] ?? 0);
    if ($baseRev !== $rev) return ['ok' => false];
    if ($rev > 0) bt_write_json(bt_save_path($username, true), $d);
    $d = ['rev' => $rev + 1, 'updated' => time(), 'save' => $saveJson];
    return ['ok' => true, 'rev' => $rev + 1];
  });
  return $done['ok'] ? $done : ['ok' => false] + bt_load_save($username);
}

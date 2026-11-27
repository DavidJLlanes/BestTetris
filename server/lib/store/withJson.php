<?php
/**
 * Abre un archivo JSON con cerrojo exclusivo, deja que $fn lo cambie y lo guarda de forma atómica.
 * $fn recibe el contenido (array) por referencia y devuelve lo que quiera devolver.
 */
function bt_with_json(string $name, callable $fn) {
  $path = bt_data_path($name);
  $lock = fopen($path . '.lock', 'c');
  if (!$lock || !flock($lock, LOCK_EX)) throw new RuntimeException('Sin cerrojo');
  try {
    $data = bt_read_json($name);
    $before = $data;
    $result = $fn($data);
    if ($data !== $before) bt_write_json($name, $data);
    return $result;
  } finally { flock($lock, LOCK_UN); fclose($lock); }
}

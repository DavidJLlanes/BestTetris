<?php
/** Lee un archivo JSON de la carpeta de datos. Si no existe, devuelve un array vacío. */
function bt_read_json(string $name): array {
  $path = bt_data_path($name);
  if (!is_file($path)) return [];
  $data = json_decode((string) file_get_contents($path), true);
  return is_array($data) ? $data : [];
}

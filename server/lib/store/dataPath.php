<?php
/** Ruta de un archivo dentro de la carpeta privada de datos. La crea si falta (solo el dueño puede entrar). */
function bt_data_path(string $name): string {
  $dir = dirname(BT_DATA_DIR . '/' . $name);
  if (!is_dir($dir) && !mkdir($dir, 0700, true) && !is_dir($dir)) throw new RuntimeException('Sin carpeta de datos');
  return BT_DATA_DIR . '/' . $name;
}

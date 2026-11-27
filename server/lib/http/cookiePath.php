<?php
/** La cookie solo viaja a la carpeta api/ del juego (p. ej. /tetris/api), no al resto del dominio. */
function bt_cookie_path(): string {
  $dir = rtrim(str_replace('\\', '/', dirname((string) ($_SERVER['SCRIPT_NAME'] ?? '/api/x.php'))), '/');
  return $dir === '' ? '/' : $dir;
}

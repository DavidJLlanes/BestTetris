<?php
/** Escribe un JSON de forma atómica (archivo temporal + renombrar): nunca queda a medias. */
function bt_write_json(string $name, array $data): void {
  $path = bt_data_path($name);
  $tmp = $path . '.' . bin2hex(random_bytes(6)) . '.tmp';
  $json = json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
  if ($json === false || file_put_contents($tmp, $json, LOCK_EX) === false) throw new RuntimeException('No se pudo guardar');
  chmod($tmp, 0600);
  if (!rename($tmp, $path)) { @unlink($tmp); throw new RuntimeException('No se pudo guardar'); }
}

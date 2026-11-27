<?php
/**
 * Lee el cuerpo JSON de la petición, con límite de tamaño.
 * Se decodifica como objetos para que {} vacíos sigan siendo {} al volver a guardarlos.
 */
function bt_read_body(int $max = 4096): object {
  $len = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
  if ($len > $max) bt_send_json(413, ['error' => 'Demasiados datos']);
  $raw = file_get_contents('php://input', false, null, 0, $max + 1);
  if ($raw === false || strlen($raw) > $max) bt_send_json(413, ['error' => 'Demasiados datos']);
  $data = json_decode($raw, false, 64);
  if (!is_object($data)) bt_send_json(400, ['error' => 'Datos no válidos']);
  return $data;
}

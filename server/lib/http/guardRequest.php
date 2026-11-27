<?php
/**
 * Solo acepta peticiones del propio juego: por HTTPS, con la cabecera X-BestTris
 * (otra web no puede ponerla sin permiso CORS, que nunca se da) y desde el mismo origen.
 */
function bt_guard_request(array $methods): void {
  $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
  if (!in_array($method, $methods, true)) bt_send_json(405, ['error' => 'Método no permitido']);
  if (($_SERVER['HTTP_X_BESTTRIS'] ?? '') !== '1') bt_send_json(403, ['error' => 'Petición no válida']);
  $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
  if ($origin !== '' && parse_url($origin, PHP_URL_HOST) !== bt_host()) bt_send_json(403, ['error' => 'Origen no válido']);
  if (!bt_is_https() && !bt_is_local()) bt_send_json(403, ['error' => 'Hace falta HTTPS']);
}

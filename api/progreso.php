<?php
/**
 * GET  → { rev, save } progreso guardado en la cuenta.
 * PUT  { baseRev, save } → { rev } si se guardó, o 409 { rev, save } si otro dispositivo guardó antes.
 */
require __DIR__ . '/../server/bootstrap.php';
bt_guard_request(['GET', 'PUT']);
$user = bt_require_user();
if ($_SERVER['REQUEST_METHOD'] === 'GET') bt_send_json(200, ['usuario' => bt_display_name($user)] + bt_load_save($user));
$body = bt_read_body(BT_MAX_SAVE_BYTES);
if (!is_int($body->baseRev ?? null) || !bt_valid_save($body->save ?? null)) bt_send_json(400, ['error' => 'Copia no válida']);
$r = bt_store_save($user, $body->baseRev, json_encode($body->save, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
if (!$r['ok']) bt_send_json(409, ['rev' => $r['rev'], 'save' => $r['save']]);
bt_send_json(200, ['rev' => $r['rev']]);

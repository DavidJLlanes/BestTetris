<?php
/** GET → usuario con sesión abierta en este dispositivo (o null). */
require __DIR__ . '/../server/bootstrap.php';
bt_guard_request(['GET']);
$user = bt_current_user();
bt_send_json(200, ['usuario' => $user === null ? null : bt_display_name($user)]);

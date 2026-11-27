<?php
/** GET → usuario con sesión abierta en este dispositivo (o null). */
require __DIR__ . '/../server/bootstrap.php';
bt_guard_request(['GET']);
bt_send_json(200, ['usuario' => bt_current_user()]);

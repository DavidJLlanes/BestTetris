<?php
/** POST → cierra la sesión de este dispositivo. */
require __DIR__ . '/../server/bootstrap.php';
bt_guard_request(['POST']);
bt_end_session();
bt_send_json(200, ['ok' => true]);

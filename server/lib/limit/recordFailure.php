<?php
/** Apunta un intento fallido. Los contadores caducan pasada la ventana. */
function bt_record_failure(string ...$keys): void {
  bt_with_json('intentos.json', function (array &$all) use ($keys) {
    foreach ($all as $k => $e) if (($e['since'] ?? 0) + BT_LIMIT_WINDOW < time()) unset($all[$k]);
    foreach ($keys as $k) {
      $e = $all[$k] ?? ['n' => 0, 'since' => time()];
      $all[$k] = ['n' => $e['n'] + 1, 'since' => $e['since']];
    }
  });
}

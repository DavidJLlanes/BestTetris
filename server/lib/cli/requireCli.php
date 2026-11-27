<?php
/** Las herramientas de cuentas solo funcionan en la terminal del servidor, nunca por la web. */
function bt_require_cli(): void {
  if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
}

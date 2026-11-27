<?php
/** En disco solo se guarda el resumen SHA-256 del token: si alguien leyera el archivo, no podría usar las sesiones. */
function bt_token_key(string $token): string {
  return hash('sha256', $token);
}

<?php
/** Nombre del servidor sin puerto. */
function bt_host(): string {
  return strtolower(preg_replace('/:\d+$/', '', (string) ($_SERVER['HTTP_HOST'] ?? '')));
}

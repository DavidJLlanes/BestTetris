<?php
/** Nombre para mostrar válido: el mismo que se usa para entrar, con las mayúsculas que se quieran. */
function bt_valid_display(string $display, string $username): bool {
  return strtolower($display) === $username && preg_match('/^[A-Za-z0-9_.-]+$/', $display) === 1;
}

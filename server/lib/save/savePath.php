<?php
/** Archivo del progreso de un usuario (el nombre ya viene validado: solo letras, números, _ . -). */
function bt_save_path(string $username, bool $previous = false): string {
  return 'progreso/' . $username . ($previous ? '.anterior' : '') . '.json';
}

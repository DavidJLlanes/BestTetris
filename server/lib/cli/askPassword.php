<?php
/** Pide la contraseña en la terminal sin mostrarla mientras se escribe. */
function bt_ask_password(string $prompt): string {
  fwrite(STDOUT, $prompt);
  $hide = DIRECTORY_SEPARATOR === '/' && stream_isatty(STDIN);
  if ($hide) shell_exec('stty -echo');
  $line = fgets(STDIN);
  if ($hide) shell_exec('stty echo');
  fwrite(STDOUT, PHP_EOL);
  return rtrim((string) $line, "\r\n");
}

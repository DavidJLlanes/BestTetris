<?php
/** Tras entrar bien, el usuario empieza de cero (la dirección no, para frenar a quien prueba muchos usuarios). */
function bt_clear_failures(string $key): void {
  bt_with_json('intentos.json', function (array &$all) use ($key) { unset($all[$key]); });
}

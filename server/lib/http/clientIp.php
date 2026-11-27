<?php
/** Dirección del cliente (la de la conexión: no se fía de cabeceras que se pueden falsificar). */
function bt_client_ip(): string {
  return (string) ($_SERVER['REMOTE_ADDR'] ?? 'desconocida');
}

<?php
/**
 * BestTris · ajustes del servidor de cuentas.
 * Los datos viven FUERA de la carpeta pública. Se puede cambiar con la variable BESTTRIS_DATA.
 */
define('BT_DATA_DIR', rtrim(getenv('BESTTRIS_DATA') ?: '/var/lib/besttris', '/'));
define('BT_SESSION_DAYS', 120);          // días que dura la sesión sin volver a escribir la contraseña
define('BT_SESSION_RENEW_DAYS', 30);     // si queda menos que esto, se alarga al usarla
define('BT_COOKIE', 'besttris_sesion');
define('BT_MAX_SAVE_BYTES', 6 * 1024 * 1024); // progreso completo con foto y repeticiones
define('BT_LIMIT_WINDOW', 15 * 60);      // ventana de intentos fallidos (segundos)
define('BT_LIMIT_USER', 5);              // fallos por usuario antes de bloquear
define('BT_LIMIT_IP', 20);               // fallos por dirección antes de bloquear
define('BT_USERNAME', '/^[a-z0-9][a-z0-9_.-]{2,31}$/');

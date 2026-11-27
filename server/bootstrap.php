<?php
/** Carga los ajustes y todas las funciones (una por archivo, en lib/). */
declare(strict_types=1);
require __DIR__ . '/config.php';
$it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator(__DIR__ . '/lib', FilesystemIterator::SKIP_DOTS));
$files = [];
foreach ($it as $f) if ($f->getExtension() === 'php') $files[] = $f->getPathname();
sort($files);
foreach ($files as $f) require $f;

// Ningún fallo interno enseña rutas ni detalles: el juego solo recibe un mensaje corto.
ini_set('display_errors', '0');
if (PHP_SAPI !== 'cli') set_exception_handler(function (Throwable $e) {
  error_log('BestTris: ' . $e->getMessage());
  bt_send_json(500, ['error' => 'El servidor no ha podido guardar. Inténtalo más tarde.']);
});

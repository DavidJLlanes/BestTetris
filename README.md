# PRISMA

Juego de puzle de bloques que caen, hecho con HTML, CSS y JavaScript sin dependencias ni paso de compilación.

## Jugar en local

```sh
python3 -m http.server 8000
# abre http://localhost:8000
```

## Características

- Modos: **Maratón** (nivel cada 10 líneas), **Sprint 40** (contrarreloj) y **Zen** (sin fin).
- Bolsa de 7 piezas, rotación con compensación de paredes, giro 180°, reserva y 5 piezas siguientes.
- Pieza fantasma, retardo de bloqueo, giros-T, combos, back-to-back y limpieza total.
- Música original y efectos sintetizados en tiempo real con Web Audio.
- Teclado, mando (Xbox y cualquier mando con mapeo estándar, con vibración) y táctil (botones y gestos).
- Récords y ajustes guardados en el navegador.

## Despliegue

Son archivos estáticos: basta con copiar `index.html`, `favicon.svg`, `css/` y `js/` a la carpeta pública
(por ejemplo `/var/www/djl.com.es/tetris/`). Todas las rutas son relativas.

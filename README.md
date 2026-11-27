# PRISMA

Juego de puzle de bloques que caen. HTML, CSS y JavaScript con módulos ES nativos: sin dependencias, sin paso de compilación y sin servidor propio. Todo el progreso se queda en el navegador del jugador.

## Jugar en local

Los módulos ES necesitan servirse por HTTP (no funcionan abriendo el archivo directamente):

```sh
npm start            # equivale a: python3 -m http.server 8000
# abre http://localhost:8000  (añade ?fps para ver el medidor de rendimiento)
npm test             # pruebas del núcleo con node:test, sin instalar nada
```

## Estructura

Cada archivo hace una sola cosa y ninguno pasa de unas 70 líneas. Las dependencias van en un solo sentido:
`config` → `core` → `modes`/`achievements` → `app` ← `input`/`render`/`audio`/`ui`.

| Carpeta | Qué contiene |
|---|---|
| `src/config/` | Constantes: tablero, tiempos, piezas, colores, giros, puntuación, controles, ajustes por defecto |
| `src/core/` | Reglas del juego en funciones puras, sin DOM: `board/`, `pieces/`, `movement/`, `rules/`, `randomizer/`, `game/` |
| `src/modes/` | Un archivo por modo en `list/` y el registro. Un modo nuevo aparece solo en el menú, los récords y los logros |
| `src/achievements/` | Catálogo de logros por categoría, motor que los comprueba y estadísticas de por vida |
| `src/app/` | Estado global, bus de eventos, bucle principal, pausa, inicio y reacciones (sonido, efectos, vibración, animación) |
| `src/input/` | Teclado, botones y gestos táctiles, mando (Gamepad API), desplazamiento automático y vibración |
| `src/render/` | Dibujo en canvas por capas, gemas pre-renderizadas, movimiento interpolado y cálculo del tamaño |
| `src/effects/` | Partículas, rótulos, rebotes con muelle y filas que bajan |
| `src/audio/` | Web Audio: voces, música original por pasos, efectos con sonido estéreo |
| `src/ui/` | Pantallas superpuestas, menús, marcador, perfil, trofeos, avisos, disposición y orientación |
| `src/storage/` | Guardado local, récords, perfil, logros y copia de seguridad versionada (exportar e importar) |
| `src/share/` | Tarjeta de progreso dibujada en el navegador y compartida con el sistema |
| `src/tutorial/` | Pasos del tutorial interactivo y pistas según el control usado |
| `src/pwa/` | Registro del service worker (`sw.js`) y botón de instalar |
| `styles/` | Un CSS por zona de la interfaz |
| `tests/` | Pruebas del núcleo, los modos, los logros y la copia de seguridad |

### Cómo ampliar

- **Modo nuevo:** crea `src/modes/list/<id>.js` (reglas y, si hace falta, `setup`, `onTick`, `onLock`, `isComplete`) y añádelo a `src/modes/registry.js`.
- **Logro nuevo:** añade una entrada a un archivo de `src/achievements/catalog/` con `on` (evento) y `test`.
- **Paso de tutorial nuevo:** añade una entrada a `src/tutorial/steps.js` con el evento que lo completa y el texto para teclado, mando y táctil.
- **Capa musical nueva:** añade una función a `src/audio/music/layers.js`; decide si suena según la tensión del tablero.
- **Paleta nueva:** añade una entrada a `src/config/palettes.js`.
- **Cambio de formato del guardado:** sube `VERSION` en `src/storage/backup/format.js` y añade el paso en `migrate.js`; las copias antiguas siguen valiendo.

## Rendimiento

Solo se anima `transform` y `opacity` en CSS. El tablero usa sprites pre-renderizados y capas cacheadas; el marcador solo toca el DOM cuando cambia un valor. Medido en pruebas: unos 0,2 ms de cálculo por fotograma (el límite para 60 fps es 16,7 ms).

## Despliegue

Son archivos estáticos: copia `index.html`, `sw.js`, `manifest.webmanifest`, `assets/`, `styles/` y `src/` a la carpeta pública (por ejemplo `/var/www/djl.com.es/tetris/`). Todas las rutas son relativas. Tras publicar cambios, sube `CACHE_VERSION` en `sw.js` para que los jugadores reciban la versión nueva al momento; el juego necesita HTTPS para poder instalarse y funcionar sin conexión.

# BestTris

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
| `src/puzzles/` | Puzles: colecciones, objetivos, siluetas del entrenador, códigos para compartir y comprobador de solución (en un worker) |
| `src/replay/` | Grabación de partidas, repeticiones y carrera contra tu fantasma |
| `src/core/undo/` | Deshacer: fotos del estado al aparecer cada pieza y coste creciente |
| `src/progress/` | Experiencia, niveles, rangos, rarezas, racha, temporada mensual y temas que se desbloquean |
| `src/social/` | Retos por enlace (semilla y marca dentro del enlace) y clasificación local por periodos |
| `src/versus/` | Dos jugadores en el mismo equipo: dos tableros, basura entre ellos, teclado partido y dos mandos |
| `src/decor/` | Decoración del fondo y del tablero: polvo de luz, latido con la música, profundidad y calidad automática |
| `src/pwa/` | Registro del service worker (`sw.js`) y botón de instalar |
| `styles/` | Un CSS por zona de la interfaz |
| `tests/` | Pruebas del núcleo, los modos, los logros y la copia de seguridad |

### Cómo ampliar

- **Modo nuevo:** crea `src/modes/list/<id>.js` (reglas y, si hace falta, `setup`, `onTick`, `onLock`, `isComplete`) y añádelo a `src/modes/registry.js`.
- **Puzle nuevo:** añade una entrada a un archivo de `src/puzzles/sets/` (tablero, piezas y objetivo). Las pruebas comprueban solas que tenga solución.
- **Poder nuevo:** añade una entrada a `src/modes/powers/powerList.js` con su `use(g)`.
- **Estación nueva o cambio de regla:** edita `src/modes/seasons/seasonList.js`.
- **Tolerancia de gestos táctiles:** ajusta `src/config/gestures.js`; las pruebas de `tests/core/gestures.test.js` simulan trazos imperfectos.
- **Logro nuevo:** añade una entrada a un archivo de `src/achievements/catalog/` con `on` (evento) y `test`.
- **Paso de tutorial nuevo:** añade una entrada a `src/tutorial/steps.js` con el evento que lo completa y el texto para teclado, mando y táctil.
- **Capa musical nueva:** añade una función a `src/audio/music/layers.js`; decide si suena según la tensión del tablero.
- **Paleta nueva:** añade una entrada a `src/config/palettes.js` y, para que se pueda elegir, a `src/progress/themes.js` con el nivel que la desbloquea.
- **Fondo o arreglo musical nuevo:** una entrada en `src/progress/themes.js` (y en `src/audio/music/styles.js` si es música).
- **Adorno nuevo del fondo:** una entrada en `src/config/decor.js` (sale solo en Ajustes > Decoración), su capa en `index.html` y su CSS en `styles/decor.css` con la clase `.no-<id>` para apagarlo.
- **Módulo nuevo:** tras añadir archivos, `npm run preload` actualiza la lista de precarga (una prueba avisa si se olvida).
- **Ataque a dos jugadores:** la tabla de basura está en `src/config/versus.js`, junto a las teclas de cada jugador.
- **Cambio de formato del guardado:** sube `VERSION` en `src/storage/backup/format.js` y añade el paso en `migrate.js`; las copias antiguas siguen valiendo.

## Rendimiento

Solo se anima `transform` y `opacity` en CSS. El tablero usa sprites pre-renderizados y capas cacheadas; el marcador solo toca el DOM cuando cambia un valor. Medido en pruebas: unos 0,2 ms de cálculo por fotograma (el límite para 60 fps es 16,7 ms).

## Despliegue (git pull)

No hay paso de compilación: la carpeta del repositorio es la web. En el servidor:

```sh
# Primera vez (la carpeta tetris/ no debe existir o estar vacía)
cd /var/www/djl.com.es
git clone https://github.com/DavidJLlanes/BestTetris.git tetris

# Cada actualización
cd /var/www/djl.com.es/tetris && git pull
```

Requisitos del servidor:

- **HTTPS**: imprescindible para instalar el juego y jugar sin conexión (service worker). Si el dominio ya sirve por HTTPS no hay que hacer nada.
- **No servir `.git`**: en Apache lo hace el `.htaccess` incluido (necesita `AllowOverride All`). En nginx, dentro del `server` del dominio:

  ```nginx
  location ~ /\.(?!well-known) { deny all; }
  location ~ ^/tetris/(tests|tools|node_modules)/ { deny all; }
  location = /tetris/sw.js { add_header Cache-Control "no-cache"; }
  ```

- Al publicar cambios grandes, sube `CACHE_VERSION` en `sw.js` para que los jugadores reciban la versión nueva al momento (si no, la reciben en la siguiente visita).

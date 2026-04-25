# Humanity vs AI — Spec-Driven Development con Claude Code

Este documento explica paso a paso cómo se construyó este juego arcade multijugador **desde cero** usando [Claude Code](https://claude.com/claude-code) y el flujo de trabajo **Spec-Driven Development (SDD)** con [OpenSpec](https://github.com/specie/openspec).

## Qué es SDD

Spec-Driven Development es un enfoque donde cada cambio al código pasa por un ciclo de tres fases:

```
/opsx:propose  →  /opsx:apply  →  /opsx:archive
   (qué)           (código)        (cerrar)
```

1. **Propose** — Describes en lenguaje natural qué quieres construir. Claude genera automáticamente: propuesta, diseño técnico, especificaciones y lista de tareas.
2. **Apply** — Claude implementa las tareas una por una, modificando el código.
3. **Archive** — Se archiva el cambio y se sincronizan las especificaciones al repositorio principal.

Cada cambio queda documentado en `openspec/changes/archive/` con toda su trazabilidad.

## Requisitos previos

- [Claude Code](https://claude.com/claude-code) instalado
- Node.js 18+
- Un proyecto Firebase con Realtime Database habilitado (para multijugador)
- El plugin OpenSpec instalado en Claude Code

## Cómo reproducir esta app

Empieza con un directorio vacío. Ejecuta cada prompt en secuencia con `/opsx:propose`. Después de cada propose, ejecuta `/opsx:apply` para implementar, y `/opsx:archive` para cerrar el cambio.

---

## Prompt 1: El juego base

```
/opsx:propose humanity-vs-ai-game
```

> Crea un juego arcade estilo Galaga llamado "Humanity vs AI". El juego se renderiza en un canvas HTML5 de 800x600 con estética pixel art y la fuente Press Start 2P.
>
> El jugador controla una nave en la parte inferior con las flechas del teclado y dispara con la barra espaciadora. El enemigo es un cerebro digital de IA en la parte superior con cuatro brazos robóticos que disparan proyectiles rojos hacia abajo.
>
> La IA tiene 1000 HP. Cada impacto del jugador resta 10 HP. Cuando llega a 0, aparece pantalla de victoria "HUMANITY WINS" con opción de reiniciar con R.
>
> El jugador muere al ser tocado por un proyectil enemigo, reaparece tras 1 segundo con 2 segundos de invulnerabilidad (efecto parpadeo).
>
> Fondo de estrellas con scroll para dar sensación de movimiento.
>
> Stack: React + Vite + Tailwind CSS. Sin librerías de juegos (no Phaser, no PixiJS). Todo el rendering con Canvas 2D nativo. El estado del juego es un objeto JS mutable (no React state) por rendimiento. Arquitectura modular: entities/ (factories), systems/ (movement, collision, render), y gameLoop.js.
>
> Firebase Realtime Database está planeado para el futuro pero no se conecta aún.

**Resultado**: Juego completo single-player con nave, cerebro IA, disparos, colisiones, sistema de vida/muerte/respawn, victoria, y fondo de estrellas.

```
/opsx:apply
/opsx:archive
```

---

## Prompt 2: Fix de cobertura de proyectiles

```
/opsx:propose fix-ai-projectile-coverage
```

> Los proyectiles de la IA caen en línea recta desde las cuatro posiciones fijas de los brazos, creando columnas predecibles con una zona segura de ~64px en el centro donde el jugador puede quedarse quieto indefinidamente sin morir.
>
> Arregla esto haciendo que cada bala apunte a una posición X aleatoria en el rango completo [0, CANVAS_W] al fondo del canvas. Calcula el vx necesario para que la bala viaje desde el brazo hasta ese punto objetivo. El resultado debe ser una distribución uniforme de impactos a lo ancho de todo el canvas, eliminando zonas seguras.

**Resultado**: Los proyectiles ahora viajan en ángulo hacia posiciones aleatorias, cubriendo todo el ancho del canvas.

```
/opsx:apply
/opsx:archive
```

---

## Prompt 3: Control remoto móvil

```
/opsx:propose mobile-remote-control
```

> Agrega control remoto desde el celular usando Firebase Realtime Database. La idea es un "party game": el juego se proyecta en una pantalla grande y los jugadores se unen desde sus celulares.
>
> - Ruta `/` muestra el juego (host con canvas)
> - Ruta `/play` muestra el controlador móvil
> - El controlador tiene botones táctiles de pantalla completa: izquierda, derecha, disparo
> - El celular escribe booleanos `{left, right, fire}` a Firebase. El host los lee en el game loop. Toda la lógica del juego se queda en el host.
> - Registro del jugador con UUID persistido en localStorage. `onDisconnect().remove()` para limpieza automática.
> - El host detecta la conexión y vincula al jugador como controlador activo.
> - Los demás `/play` clients ven pantalla de "WAITING".
> - Feedback háptico (`navigator.vibrate(20)`) al presionar botones.
> - El teclado sigue funcionando como fallback cuando no hay jugador móvil conectado.
> - Sin React Router — routing simple por pathname.
> - Firebase v9+ con imports modulares.
> - Credenciales en `.env` con prefijo `VITE_`.
> - Reglas de seguridad abiertas (modo demo).

**Resultado**: Cualquier persona puede controlar el juego desde su celular abriendo `/play`.

```
/opsx:apply
/opsx:archive
```

---

## Prompt 4: Sistema de cola multijugador

```
/opsx:propose multiplayer-queue-system
```

> Convierte el juego en multijugador simultáneo con sistema de cola. La experiencia completa de "party game" donde docenas de personas pueden unirse desde sus celulares.
>
> - Slots configurables de 1 a 12 pilotos activos, controlados desde un panel de admin en el host
> - Sistema de cola FIFO: nuevos jugadores entran como "queued", se promueven a "playing" cuando hay slot libre, pasan a "dead" al morir y se re-encolan automáticamente
> - Paleta de 12 colores de alto contraste asignados a cada jugador activo. Los colores se reciclan cuando un jugador muere.
> - Múltiples naves en el canvas, distribuidas en 4 lanes horizontales invisibles para evitar superposición visual
> - Sin respawn automático — la muerte libera el slot para el siguiente en la cola
> - HP de la IA escala dinámicamente: `maxPlayers × 1000`, preservando el porcentaje de vida actual cuando maxPlayers cambia
> - Controlador móvil actualizado: muestra posición en cola cuando espera, "FLY" cuando está jugando, "ELIMINATED + QUEUE #N" al morir. Botones deshabilitados cuando no está jugando. Banner de color del jugador asignado (o gris si está en cola).
> - Pantalla de victoria muestra los colores de TODOS los jugadores que participaron
> - Mantener fallback de teclado single-player cuando no hay jugadores móviles
> - Panel de admin debajo del canvas con "Active pilots: N" y botón + para incrementar
> - `maxPlayers` guardado en Firebase `config/maxPlayers`

**Resultado**: Juego multijugador completo con cola, colores, lanes, HP escalado, y panel de admin.

```
/opsx:apply
/opsx:archive
```

---

## Prompt 5: Sonidos del juego

```
/opsx:propose add-game-sounds
```

> Agrega efectos de sonido 8-bit sintetizados con Web Audio API. Sin archivos de audio externos — todo generado con osciladores, coherente con la estética pixel art.
>
> 6 sonidos:
> - **playerShoot**: onda cuadrada, 880Hz, duración 50ms
> - **playerHit**: diente de sierra, 200Hz→50Hz sweep down, 200ms
> - **enemyShoot**: onda cuadrada, 220Hz, 80ms
> - **aiHit**: onda cuadrada, 1200Hz, 30ms
> - **aiDeath**: diente de sierra, 800Hz→100Hz sweep, 1.5s
> - **victory**: arpegio de 3 notas (523, 659, 784 Hz), ondas cuadradas
>
> Implementación:
> - AudioContext lazy (se crea en el primer sonido, por política del navegador)
> - Flag global de mute con `setMuted(bool)` e `isMuted()`
> - Cada función de sonido checa el flag de mute antes de sonar
> - Volumen por defecto: 0.3
> - GainNode con decaimiento exponencial para evitar sonidos planos
> - Nuevo módulo `src/game/audio.js`
> - Integración directa en movement.js (disparo), collision.js (impactos, muerte), gameLoop.js (victoria)
> - Botón de mute toggle en AdminPanel ("SOUND ON" / "SOUND OFF")
> - Sin dependencias nuevas

**Resultado**: El juego tiene audio 8-bit reactivo a todos los eventos del juego, con toggle de mute.

```
/opsx:apply
/opsx:archive
```

---

## Estructura del proyecto resultante

```
humanity/
├── index.html
├── package.json
├── vite.config.js
├── firebase.json
├── database.rules.json
├── .env.example
├── src/
│   ├── main.jsx              # Entry point + routing
│   ├── App.jsx               # Router (/ vs /play)
│   ├── GameCanvas.jsx        # Canvas host + admin panel
│   ├── MobileController.jsx  # Touch controller (/play)
│   ├── AdminPanel.jsx        # Pilot count + mute toggle
│   ├── index.css             # Tailwind + custom styles
│   ├── firebase.js           # Firebase SDK init
│   ├── hooks/
│   │   ├── useHostPlayers.js    # Queue system, promotion, death
│   │   └── usePlayerConnection.js  # Mobile player registration
│   └── game/
│       ├── state.js           # Game state factory
│       ├── gameLoop.js        # rAF loop orchestrator
│       ├── audio.js           # Web Audio API synth sounds
│       ├── constants.js       # Colors, lanes, config
│       ├── colors.js          # Color assignment
│       ├── lanes.js           # Lane distribution
│       ├── entities/
│       │   ├── brain.js       # AI boss factory
│       │   ├── ship.js        # Player ship factory
│       │   ├── bullet.js      # Bullet factories
│       │   └── starfield.js   # Background stars
│       └── systems/
│           ├── movement.js    # Ship + bullet movement
│           ├── collision.js   # Hit detection
│           └── render.js      # Canvas 2D drawing
└── openspec/                  # SDD artifacts (specs, archives)
```

## Notas

- Durante la creación en vivo del juego, pueden haberse ejecutado ajustes estéticos y modificaciones menores directamente con Claude Code, sin pasar por el flujo de OpenSpec. Los prompts documentados aquí cubren los cambios estructurales principales.
- Cada prompt produce un ciclo completo: propuesta → diseño → specs → tareas → implementación → archivo.
- Los archivos en `openspec/changes/archive/` contienen la trazabilidad completa de cada cambio.
- Los specs acumulados en `openspec/specs/` son la "verdad" actual del sistema.
- El orden importa: cada prompt asume el código resultante de los anteriores.
- Para Firebase: crea un proyecto, habilita Realtime Database, y copia las credenciales a `.env` (ver `.env.example`).

---

## Referencias

### Herramientas utilizadas

| Herramienta | Descripción | Enlace |
|---|---|---|
| **Claude Code** | CLI de Anthropic para desarrollo asistido por IA. Agente de código que edita archivos, ejecuta comandos, y entiende el contexto completo del proyecto. | [claude.ai/claude-code](https://claude.ai/claude-code) |
| **OpenSpec** | Framework de Spec-Driven Development. Define un flujo estructurado para proponer, especificar, implementar y archivar cambios en un codebase. | [github.com/specie/openspec](https://github.com/specie/openspec) |
| **Claude (modelo)** | Modelo de lenguaje de Anthropic que potencia Claude Code. Este proyecto se construyó con Claude Opus. | [anthropic.com](https://www.anthropic.com) |

### Stack técnico

| Tecnología | Uso en el proyecto | Documentación |
|---|---|---|
| **React** | UI components (GameCanvas, MobileController, AdminPanel) | [react.dev](https://react.dev) |
| **Vite** | Build tool y dev server | [vite.dev](https://vite.dev) |
| **Tailwind CSS** | Estilos utilitarios | [tailwindcss.com](https://tailwindcss.com) |
| **Firebase Realtime Database** | Sincronización en tiempo real entre host y controladores móviles | [firebase.google.com/docs/database](https://firebase.google.com/docs/database) |
| **Canvas 2D API** | Rendering del juego (sin librerías) | [developer.mozilla.org/en-US/docs/Web/API/Canvas_API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) |
| **Web Audio API** | Sonidos 8-bit sintetizados con osciladores | [developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) |
| **Press Start 2P** | Fuente pixel art | [fonts.google.com/specimen/Press+Start+2P](https://fonts.google.com/specimen/Press+Start+2P) |

### Sobre Spec-Driven Development

SDD es un enfoque donde la especificación es el artefacto central del desarrollo. En vez de escribir código directamente, describes **qué** quieres en lenguaje natural. El agente de IA genera especificaciones formales, diseño técnico, y tareas — y luego implementa el código siguiendo esos artefactos.

Ventajas observadas en este proyecto:
- **Trazabilidad**: Cada línea de código tiene un camino claro desde el prompt original → propuesta → diseño → spec → tarea → implementación.
- **Iteración incremental**: Cambios pequeños y bien definidos que se acumulan. Cada cambio tiene su propio contexto aislado.
- **Documentación automática**: Las specs en `openspec/specs/` son documentación viva del sistema, actualizada con cada cambio.
- **Reproducibilidad**: Este documento demuestra que la app puede regenerarse ejecutando 6 prompts en secuencia.

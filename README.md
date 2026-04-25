# Humanity vs AI

Juego arcade multijugador estilo Galaga donde los jugadores se unen desde sus celulares para derrotar juntos a una IA malvada.

Este proyecto fue creado en vivo durante la charla **"Creando software con IA y Spec-Driven Development"** por **Fabio Cavassini** en el [Google Developers Group San Juan](https://gdg.community.dev/gdg-san-juan/), el 25 de abril de 2026.

Todo el código fue generado con [Claude Code](https://claude.ai/claude-code) usando el flujo de trabajo [OpenSpec](https://github.com/specie/openspec) (Spec-Driven Development).

## El juego

Un cerebro de IA con brazos robóticos dispara proyectiles desde la parte superior de la pantalla. Los jugadores controlan naves desde sus celulares y deben destruirlo colaborativamente.

- Hasta 12 jugadores simultáneos
- Los jugadores se unen escaneando un QR o abriendo `/play` desde el celular
- Sistema de cola FIFO: cuando un jugador muere, el siguiente en la cola entra
- Cada jugador tiene un color único
- Sonidos 8-bit sintetizados (sin archivos de audio)
- Pantalla de victoria con los colores de todos los participantes

## Cómo ejecutar

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env
# Editar .env con las credenciales de tu proyecto Firebase

# Iniciar en modo desarrollo
npm run dev
```

Abrir `http://localhost:5173` para el juego (host) y `http://localhost:5173/play` desde el celular para el controlador.

### Firebase

Para el modo multijugador necesitas un proyecto Firebase con Realtime Database habilitado:

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilita Realtime Database
3. Copia las credenciales a `.env` (ver `.env.example`)

Sin Firebase configurado, el juego funciona en modo single-player con teclado (flechas + barra espaciadora).

## Los prompts

El archivo **[PROMPTS.md](PROMPTS.md)** contiene los 5 prompts exactos que se usaron para generar todo el código de este proyecto, con instrucciones para reproducirlo desde cero.

## Stack

- **React + Vite + Tailwind CSS** — UI y build
- **Canvas 2D nativo** — Rendering del juego (sin librerías de juegos)
- **Firebase Realtime Database** — Sincronización host-celulares
- **Web Audio API** — Sonidos sintetizados con osciladores
- **Claude Code + OpenSpec** — Desarrollo asistido por IA con SDD

## Estructura

```
src/
├── main.jsx                  # Entry point + routing
├── App.jsx                   # Router (/ vs /play)
├── GameCanvas.jsx            # Canvas host + admin panel
├── MobileController.jsx      # Controlador táctil (/play)
├── AdminPanel.jsx            # Panel de admin (pilots + mute)
├── firebase.js               # Firebase SDK init
├── hooks/                    # Queue system + player connection
└── game/
    ├── state.js              # Estado del juego
    ├── gameLoop.js           # Loop principal (rAF)
    ├── audio.js              # Sonidos 8-bit
    ├── entities/             # Factories (brain, ship, bullet)
    └── systems/              # Movement, collision, render
```

## Licencia

MIT

# Lingo 🦜 — Aprende inglés jugando

Aplicación web estilo Duolingo para hispanohablantes que aprenden inglés. Sin backend: todo el progreso se guarda en `localStorage`.

## Características

- **7 unidades temáticas** (saludos, comida, viajes, trabajo, tiempo/clima, conversación cotidiana e inglés profesional) con 29 lecciones y ~230 ejercicios.
- **7 tipos de ejercicio**: opción múltiple, completar espacio, traducción libre, emparejar palabras, ordenar palabras, escuchar-y-elegir (texto-a-voz) y **pronunciación** (hablas al micrófono y la app evalúa con reconocimiento de voz).
- **Repaso inteligente**: repetición espaciada de lo que fallas (intervalos 1/3/7/14/30 días). No arriesga corazones y al terminar recupera uno.
- **Meta diaria de XP** configurable (pensada para micro-sesiones de 5-10 min) con barra de progreso en el Home.
- **Gamificación**: racha diaria con protectores ("freezes"), XP y niveles, 5 vidas que se regeneran cada 30 min, mapa de unidades con desbloqueo lineal y 11 logros.
- **Accesible y responsive**: atajos de teclado (1–9 para opciones, Enter para comprobar/continuar), `aria-labels`, foco visible, diseño mobile-first.

## Instalación

Requisitos: Node.js 20+.

```bash
npm install
npm run dev      # servidor de desarrollo en http://localhost:5173
npm run build    # type-check + build de producción en dist/
npm run lint     # ESLint
```

## Stack

| Capa | Tecnología |
| --- | --- |
| UI | React 19 + TypeScript estricto |
| Bundler | Vite |
| Estilos | Tailwind CSS v4 (config CSS-first en `src/index.css`) |
| Estado | Zustand + `persist` middleware (`localStorage`, key `lingo-progress`) |
| Rutas | React Router (`/`, `/lesson/:unitId/:lessonId`, `/results`, `/profile`) |
| Audio | Web Speech API (`speechSynthesis`, voz en-US) |

## Estructura del proyecto

```
src/
  components/
    exercises/    # Un componente presentacional por tipo de ejercicio
    ui/           # ChunkyButton, ProgressBar, HeartsDisplay, Confetti, TopBar…
  pages/          # HomePage (mapa), LessonPage, ResultsPage, ProfilePage
  hooks/          # useLessonSession (máquina de estados), useSpeech (TTS), useNow
  lib/            # Lógica de negocio pura: validación, XP, racha, vidas, logros
  store/          # useProgressStore (Zustand persistido)
  data/
    lessons/      # Contenido: un archivo por unidad + índice
    builders.ts   # Factories (mc, fill, translate, match, order, listen)
    achievements.ts
  types.ts        # Tipos del dominio
```

### Agregar contenido

El contenido vive en `src/data/lessons/`, separado de los componentes. Para añadir una unidad: crea `unitN-tema.ts` usando las factories de `data/builders.ts` y regístrala en `data/lessons/index.ts`. Nada más que tocar.

### Reglas de juego

- **XP**: 10 por ejercicio correcto al primer intento, +20 de bonus por lección perfecta. En repaso: 5 XP por ejercicio.
- **Repaso**: los ejercicios fallados se agendan con repetición espaciada; el botón "Repaso" del Home muestra cuántos hay pendientes y sirve también como práctica libre.
- **Vidas**: máximo 5; se pierde 1 por error; regenera 1 cada 30 minutos (cálculo perezoso, sin timers persistentes). Sin vidas no se puede iniciar una lección.
- **Racha**: un día cuenta si completas al menos una lección. Si faltas un día y tienes un protector 🧊, se consume automáticamente. Empiezas con 1 y ganas otro por cada hito de 7 días (máx. 2).
- **Progresión**: lineal estricta — cada lección desbloquea la siguiente; completar una unidad abre la próxima.
- Los ejercicios fallados se re-encolan al final de la lección hasta responderlos bien.

Más detalle de arquitectura y decisiones en [CLAUDE.md](CLAUDE.md).

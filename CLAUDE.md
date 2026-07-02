# Lingo — App de aprendizaje de inglés (estilo Duolingo)

App web SPA para hispanohablantes que aprenden inglés. Sin backend: todo el estado vive en el cliente y se persiste en `localStorage`.

## Stack

- **React 19 + TypeScript (estricto, sin `any`)** — Vite como bundler.
- **Tailwind CSS v4** — configuración CSS-first vía `@theme` en `src/index.css` (no hay `tailwind.config.js`).
- **Zustand + persist middleware** — estado global persistido en `localStorage` bajo la key `lingo-progress`.
- **React Router v7** (`react-router-dom`) — enrutado cliente.
- **Web Speech API** (`speechSynthesis`) — texto-a-voz para ejercicios de escucha. No hay archivos de audio.

## Estructura de carpetas

```
src/
  components/
    exercises/    # Un componente presentacional por tipo de ejercicio
    ui/           # Componentes genéricos (Button, ProgressBar, Hearts, Confetti…)
  pages/          # Vistas de rutas: HomePage, LessonPage, ResultsPage, ProfilePage
  hooks/          # useLessonSession (máquina de estados de la lección), useSpeech (TTS)
  lib/            # Lógica de negocio PURA y testeable (sin React, sin store)
  store/          # Store de Zustand (useProgressStore)
  data/
    lessons/      # Contenido: un archivo por unidad (unit1-greetings.ts, …)
    builders.ts   # Factories para definir ejercicios sin boilerplate
    achievements.ts
  types.ts        # Todos los tipos del dominio
```

## Arquitectura y convenciones

**Regla central: los componentes son "tontos".** Toda la lógica de negocio vive en `src/lib/` como funciones puras `(input) → output` sin efectos, importadas por el store o por hooks. Los componentes de ejercicio reciben el ejercicio + callbacks vía props y no tocan el store directamente.

- `lib/validation.ts` — normalización de respuestas (minúsculas, sin tildes ni puntuación) y comparación contra lista de respuestas aceptadas.
- `lib/xp.ts` — cálculo de XP y niveles.
- `lib/streak.ts` — lógica de racha diaria y consumo de freezes. Trabaja con fechas `YYYY-MM-DD` locales.
- `lib/hearts.ts` — regeneración perezosa de corazones: se calcula al leer, a partir de `lastRegenAt`, no con timers persistentes.
- `lib/unlock.ts` — desbloqueo lineal de lecciones/unidades a partir del set de lecciones completadas.
- `lib/achievements.ts` — evaluación de logros contra el estado; devuelve los recién desbloqueados.

**Flujo de una lección** (`hooks/useLessonSession.ts`): cola de ejercicios → responder → feedback (correcto/incorrecto) → los fallados se re-encolan al final → al vaciar la cola se calcula XP y se llama `completeLesson` en el store → navegación a `/results` con el resumen en `location.state`. Si los corazones llegan a 0, la lección termina en fallo.

**Rutas**: `/` (mapa de unidades), `/lesson/:unitId/:lessonId`, `/results`, `/profile`.

## Estructura de datos de lecciones

Contenido en `src/data/lessons/`, un archivo TS por unidad, agregados en `src/data/lessons/index.ts` como `UNITS: Unit[]`. Nada de contenido hardcodeado en componentes.

```
Unit { id, title, description, color, icon, lessons: Lesson[] }
Lesson { id, title, exercises: Exercise[] }
Exercise (unión discriminada por `type`):
  multiple-choice { question, options[], correctIndex }
  fill-blank      { sentence ("I ___ coffee"), options[], correctIndex }
  translate       { text, direction: 'en-es' | 'es-en', accepted[] }  // input libre
  match-pairs     { pairs: {left (EN), right (ES)}[] }
  word-order      { prompt (frase ES), words[] (tokens + distractores), correct }
  listen-choose   { ttsText (se pronuncia con TTS), options[], correctIndex }
```

Los archivos de unidad usan las factories de `data/builders.ts` (`mc`, `fill`, `translate`, `match`, `order`, `listen`, `lesson`, que asignan ids automáticamente). Para agregar contenido: crear/editar un archivo de unidad y registrarlo en el índice; no hay que tocar nada más.

## Decisiones de producto (confirmadas por el usuario)

- **Vidas**: máx. 5; se pierde 1 por respuesta incorrecta; regenera 1 cada **30 minutos** (cálculo perezoso).
- **XP**: **10 XP** por ejercicio correcto al primer intento + **20 XP** de bonus por lección perfecta (0 errores).
- **Progresión**: **lineal estricta** — cada lección desbloquea la siguiente; completar todas las lecciones de una unidad desbloquea la unidad siguiente.
- **Idioma UI**: **español**; el contenido a aprender es inglés.
- **Racha**: día activo = completar ≥1 lección. Si falta 1 día y hay freeze disponible, se consume automáticamente y la racha sobrevive. El usuario parte con 1 freeze y gana 1 por cada hito de racha de 7 días (máx. acumulable: 2).
- **Niveles**: nivel = f(XP total) con curva suave (`lib/xp.ts`); son cosméticos (perfil), no bloquean contenido.

## Dirección de diseño

- Paleta vibrante y amigable definida en `@theme` (`src/index.css`): verde primario `#22c55e`-familia para acciones/acierto, coral `#ff4b6e` para error/corazones, amarillo `#ffc800` para racha/XP, y un color identitario por unidad (verde, naranja, cielo, violeta, rosa).
- Tipografía **Nunito** (Google Fonts) — redondeada y amigable.
- Botones "chunky" con profundidad (borde inferior de 4px que se hunde al presionar), tarjetas `rounded-2xl`.
- Feedback inmediato: banner verde/rojo tras responder con `aria-live`, animación de corazón perdido, confetti CSS propio (sin dependencias) al completar lección.
- Accesibilidad: navegación por teclado en ejercicios (atajos numéricos en opciones, Enter para continuar), `aria-label` en controles icónicos, foco gestionado entre ejercicios.
- Mobile-first: layout de una columna con máx. `max-w-xl` centrado; el mapa y los ejercicios funcionan a 375px.

## Comandos

- `npm run dev` — servidor de desarrollo.
- `npm run build` — type-check (`tsc -b`) + build de producción. Úsalo como verificación de tipos.
- `npm run lint` — ESLint.

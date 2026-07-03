// ---------- Contenido ----------

export type ExerciseType =
  | 'multiple-choice'
  | 'fill-blank'
  | 'translate'
  | 'match-pairs'
  | 'word-order'
  | 'listen-choose'
  | 'speak';

interface ExerciseBase {
  id: string;
  type: ExerciseType;
}

export interface MultipleChoiceExercise extends ExerciseBase {
  type: 'multiple-choice';
  question: string;
  options: string[];
  correctIndex: number;
}

export interface FillBlankExercise extends ExerciseBase {
  type: 'fill-blank';
  /** Oración con `___` marcando el hueco, p. ej. "I ___ coffee every morning". */
  sentence: string;
  options: string[];
  correctIndex: number;
}

export type TranslateDirection = 'en-es' | 'es-en';

export interface TranslateExercise extends ExerciseBase {
  type: 'translate';
  text: string;
  direction: TranslateDirection;
  /** Respuestas aceptadas; se comparan normalizadas (ver lib/validation). */
  accepted: string[];
}

export interface MatchPair {
  left: string; // inglés
  right: string; // español
}

export interface MatchPairsExercise extends ExerciseBase {
  type: 'match-pairs';
  pairs: MatchPair[];
}

export interface WordOrderExercise extends ExerciseBase {
  type: 'word-order';
  /** Frase en español a traducir ordenando palabras. */
  prompt: string;
  /** Tokens disponibles (incluye distractores), sin ordenar. */
  words: string[];
  /** Oración correcta en inglés. */
  correct: string;
}

export interface ListenChooseExercise extends ExerciseBase {
  type: 'listen-choose';
  /** Texto que se pronuncia con SpeechSynthesis (en-US). */
  ttsText: string;
  options: string[];
  correctIndex: number;
}

export interface SpeakExercise extends ExerciseBase {
  type: 'speak';
  /** Frase en inglés que el usuario debe leer en voz alta. */
  text: string;
  /** Traducción al español, mostrada como apoyo. */
  translation: string;
}

export type Exercise =
  | MultipleChoiceExercise
  | FillBlankExercise
  | TranslateExercise
  | MatchPairsExercise
  | WordOrderExercise
  | ListenChooseExercise
  | SpeakExercise;

export interface Lesson {
  id: string;
  title: string;
  exercises: Exercise[];
}

export type UnitColor = 'green' | 'orange' | 'sky' | 'violet' | 'pink' | 'teal' | 'indigo';

export interface Unit {
  id: string;
  title: string;
  description: string;
  color: UnitColor;
  /** Emoji identitario de la unidad. */
  icon: string;
  lessons: Lesson[];
}

// ---------- Progreso del usuario ----------

export interface LessonRecord {
  completedAt: string; // ISO
  perfect: boolean;
  timesCompleted: number;
}

export interface StreakState {
  count: number;
  /** Último día activo, formato local YYYY-MM-DD. Vacío si nunca hubo actividad. */
  lastActiveDate: string;
  freezes: number;
  /** Hitos de 7 días ya premiados con un freeze (evita premiar dos veces). */
  lastFreezeMilestone: number;
}

export interface HeartsState {
  count: number;
  /** Epoch ms desde el que corre la regeneración del siguiente corazón. */
  lastRegenAt: number;
}

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: string;
}

// ---------- Repaso (repetición espaciada) ----------

export interface ReviewRecord {
  /** Fecha local YYYY-MM-DD en la que el ejercicio vuelve a estar pendiente. */
  due: string;
  /** Nivel de dominio: sube al acertar en repaso, se reinicia al fallar. */
  level: number;
}

// ---------- Sesión (lección o repaso) ----------

export type SessionMode = 'lesson' | 'review';

export interface LessonResult {
  mode: SessionMode;
  unitId: string;
  lessonId: string;
  lessonTitle: string;
  totalExercises: number;
  mistakes: number;
  xpEarned: number;
  perfect: boolean;
  failed: boolean;
  /** true si el repaso restauró un corazón. */
  heartRestored: boolean;
  newAchievements: AchievementDef[];
}

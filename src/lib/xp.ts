export const XP_PER_EXERCISE = 10;
export const PERFECT_LESSON_BONUS = 20;

/**
 * XP de una lección: cada ejercicio resuelto al primer intento suma XP;
 * lección perfecta (0 errores) agrega bonus.
 */
export function calcLessonXp(totalExercises: number, mistakes: number): number {
  const firstTryCorrect = Math.max(0, totalExercises - mistakes);
  const base = firstTryCorrect * XP_PER_EXERCISE;
  return mistakes === 0 ? base + PERFECT_LESSON_BONUS : base;
}

/**
 * Nivel cosmético a partir del XP total. Curva suave: cada nivel
 * requiere 100 XP más que el anterior (100, 200, 300…).
 */
export function levelForXp(xp: number): number {
  let level = 1;
  let threshold = 100;
  let remaining = xp;
  while (remaining >= threshold) {
    remaining -= threshold;
    threshold += 100;
    level += 1;
  }
  return level;
}

/** Progreso [0,1] dentro del nivel actual, para barras de progreso. */
export function levelProgress(xp: number): { current: number; needed: number; ratio: number } {
  let threshold = 100;
  let remaining = xp;
  while (remaining >= threshold) {
    remaining -= threshold;
    threshold += 100;
  }
  return { current: remaining, needed: threshold, ratio: remaining / threshold };
}

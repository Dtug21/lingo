import type { Exercise, LessonRecord, ReviewRecord, Unit } from '../types';
import { daysBetween } from './dates';
import { shuffle } from './shuffle';

export const REVIEW_XP_PER_EXERCISE = 5;
export const REVIEW_SESSION_SIZE = 10;
/** Días hasta el próximo repaso según el nivel de dominio (repetición espaciada). */
const INTERVALS_DAYS = [1, 3, 7, 14, 30];

function addDays(dateKey: string, days: number): string {
  const d = new Date(`${dateKey}T00:00:00`);
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Registro tras fallar un ejercicio en una lección: vuelve a repaso mañana. */
export function recordAfterMistake(todayKey: string): ReviewRecord {
  return { due: addDays(todayKey, 1), level: 0 };
}

/**
 * Registro tras responder en un repaso: acertar sube el nivel y aleja el
 * próximo repaso; fallar reinicia el nivel y lo trae de vuelta mañana.
 */
export function recordAfterReview(
  record: ReviewRecord | undefined,
  correct: boolean,
  todayKey: string,
): ReviewRecord {
  if (!correct) return { due: addDays(todayKey, 1), level: 0 };
  const level = Math.min((record?.level ?? 0) + 1, INTERVALS_DAYS.length - 1);
  return { due: addDays(todayKey, INTERVALS_DAYS[level]), level };
}

export function isDue(record: ReviewRecord, todayKey: string): boolean {
  return daysBetween(record.due, todayKey) >= 0;
}

/**
 * Arma la sesión de repaso: primero los ejercicios pendientes (vencidos),
 * y si faltan, rellena con ejercicios al azar de lecciones ya completadas
 * ("repaso general"). Máximo REVIEW_SESSION_SIZE.
 */
export function buildReviewSession(
  units: Unit[],
  completedLessons: Record<string, LessonRecord>,
  reviewRecords: Record<string, ReviewRecord>,
  todayKey: string,
): Exercise[] {
  const exerciseById = new Map<string, Exercise>();
  const completedPool: Exercise[] = [];
  for (const unit of units) {
    for (const lesson of unit.lessons) {
      for (const exercise of lesson.exercises) {
        exerciseById.set(exercise.id, exercise);
        if (completedLessons[lesson.id] !== undefined) completedPool.push(exercise);
      }
    }
  }

  const due = Object.entries(reviewRecords)
    .filter(([id, record]) => exerciseById.has(id) && isDue(record, todayKey))
    .map(([id]) => exerciseById.get(id))
    .filter((e): e is Exercise => e !== undefined);

  const session = shuffle(due).slice(0, REVIEW_SESSION_SIZE);
  if (session.length < REVIEW_SESSION_SIZE) {
    const chosen = new Set(session.map((e) => e.id));
    const filler = shuffle(completedPool.filter((e) => !chosen.has(e.id)));
    session.push(...filler.slice(0, REVIEW_SESSION_SIZE - session.length));
  }
  return session;
}

/** Cantidad de ejercicios pendientes de repaso hoy (para el badge del Home). */
export function countDue(
  reviewRecords: Record<string, ReviewRecord>,
  todayKey: string,
): number {
  return Object.values(reviewRecords).filter((r) => isDue(r, todayKey)).length;
}

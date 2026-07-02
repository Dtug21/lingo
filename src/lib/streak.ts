import type { StreakState } from '../types';
import { daysBetween } from './dates';

export const INITIAL_STREAK: StreakState = {
  count: 0,
  lastActiveDate: '',
  freezes: 1, // el usuario parte con un freeze de regalo
  lastFreezeMilestone: 0,
};

export const MAX_FREEZES = 2;
export const FREEZE_MILESTONE_DAYS = 7;

/**
 * Actualiza la racha al registrar actividad en `todayKey` (YYYY-MM-DD local).
 * - Mismo día: sin cambios.
 * - Día siguiente: racha +1.
 * - Faltó exactamente 1 día y hay freeze: se consume y la racha continúa (+1).
 * - Hueco mayor (o sin freeze): la racha reinicia en 1.
 * Cada hito de 7 días otorga un freeze (máx. MAX_FREEZES acumulados).
 */
export function recordActivity(streak: StreakState, todayKey: string): StreakState {
  let next: StreakState;

  if (streak.lastActiveDate === '') {
    next = { ...streak, count: 1, lastActiveDate: todayKey };
  } else {
    const gap = daysBetween(streak.lastActiveDate, todayKey);
    if (gap <= 0) {
      return streak; // mismo día (o reloj movido hacia atrás): nada que hacer
    }
    if (gap === 1) {
      next = { ...streak, count: streak.count + 1, lastActiveDate: todayKey };
    } else if (gap === 2 && streak.freezes > 0) {
      next = {
        ...streak,
        count: streak.count + 1,
        freezes: streak.freezes - 1,
        lastActiveDate: todayKey,
      };
    } else {
      next = { ...streak, count: 1, lastActiveDate: todayKey, lastFreezeMilestone: 0 };
    }
  }

  // Premio por hito de 7 días (una sola vez por hito)
  const milestone = Math.floor(next.count / FREEZE_MILESTONE_DAYS);
  if (milestone > next.lastFreezeMilestone) {
    next = {
      ...next,
      lastFreezeMilestone: milestone,
      freezes: Math.min(MAX_FREEZES, next.freezes + 1),
    };
  }
  return next;
}

/**
 * Racha efectiva para MOSTRAR hoy sin registrar actividad:
 * si el último día activo fue ayer u hoy sigue viva; si fue anteayer y hay
 * freeze aún puede salvarse; más atrás, se muestra 0.
 */
export function displayStreak(streak: StreakState, todayKey: string): number {
  if (streak.lastActiveDate === '') return 0;
  const gap = daysBetween(streak.lastActiveDate, todayKey);
  if (gap <= 1) return streak.count;
  if (gap === 2 && streak.freezes > 0) return streak.count;
  return 0;
}

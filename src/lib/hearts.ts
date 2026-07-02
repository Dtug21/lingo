import type { HeartsState } from '../types';

export const MAX_HEARTS = 5;
export const HEART_REGEN_MS = 30 * 60 * 1000; // 1 corazón cada 30 minutos

export const INITIAL_HEARTS: HeartsState = {
  count: MAX_HEARTS,
  lastRegenAt: 0,
};

/**
 * Regeneración perezosa: aplica los corazones acumulados desde `lastRegenAt`.
 * Idempotente — puede llamarse en cada render/lectura.
 */
export function applyRegen(hearts: HeartsState, now: number): HeartsState {
  if (hearts.count >= MAX_HEARTS) {
    return hearts.count === MAX_HEARTS ? hearts : { ...hearts, count: MAX_HEARTS };
  }
  const elapsed = now - hearts.lastRegenAt;
  const regenerated = Math.floor(elapsed / HEART_REGEN_MS);
  if (regenerated <= 0) return hearts;

  const count = Math.min(MAX_HEARTS, hearts.count + regenerated);
  return {
    count,
    // conserva el resto del intervalo para no "perder" tiempo de regeneración
    lastRegenAt: count === MAX_HEARTS ? 0 : hearts.lastRegenAt + regenerated * HEART_REGEN_MS,
  };
}

export function loseHeart(hearts: HeartsState, now: number): HeartsState {
  const current = applyRegen(hearts, now);
  const count = Math.max(0, current.count - 1);
  return {
    count,
    // si estaba lleno, el temporizador de regeneración parte ahora
    lastRegenAt: current.count === MAX_HEARTS ? now : current.lastRegenAt,
  };
}

/** Milisegundos hasta el próximo corazón, o null si está lleno. */
export function msUntilNextHeart(hearts: HeartsState, now: number): number | null {
  const current = applyRegen(hearts, now);
  if (current.count >= MAX_HEARTS) return null;
  return Math.max(0, current.lastRegenAt + HEART_REGEN_MS - now);
}

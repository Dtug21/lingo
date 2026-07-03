import type { LessonRecord, Unit } from '../types';
import { ACHIEVEMENTS } from '../data/achievements';
import { isUnitCompleted } from './unlock';

export interface AchievementSnapshot {
  xp: number;
  streakCount: number;
  completedLessons: Record<string, LessonRecord>;
  reviewsCompleted: number;
  units: Unit[];
}

/** Evalúa la condición de cada logro contra el estado actual. */
function isEarned(id: string, s: AchievementSnapshot): boolean {
  const lessonCount = Object.keys(s.completedLessons).length;
  switch (id) {
    case 'first-lesson':
      return lessonCount >= 1;
    case 'perfect-lesson':
      return Object.values(s.completedLessons).some((r) => r.perfect);
    case 'streak-3':
      return s.streakCount >= 3;
    case 'streak-7':
      return s.streakCount >= 7;
    case 'xp-100':
      return s.xp >= 100;
    case 'xp-500':
      return s.xp >= 500;
    case 'lessons-10':
      return lessonCount >= 10;
    case 'first-review':
      return s.reviewsCompleted >= 1;
    case 'reviews-10':
      return s.reviewsCompleted >= 10;
    case 'first-unit':
      return s.units.some((u) => isUnitCompleted(u, s.completedLessons));
    case 'all-units':
      return s.units.every((u) => isUnitCompleted(u, s.completedLessons));
    default:
      return false;
  }
}

/** Devuelve los ids de logros recién ganados (no presentes en `alreadyUnlocked`). */
export function checkNewAchievements(
  snapshot: AchievementSnapshot,
  alreadyUnlocked: string[],
): string[] {
  const owned = new Set(alreadyUnlocked);
  return ACHIEVEMENTS.filter((a) => !owned.has(a.id) && isEarned(a.id, snapshot)).map((a) => a.id);
}

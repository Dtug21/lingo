import type { LessonRecord, Unit } from '../types';

type Completed = Record<string, LessonRecord>;

export function isUnitCompleted(unit: Unit, completed: Completed): boolean {
  return unit.lessons.every((l) => completed[l.id] !== undefined);
}

/** Progresión lineal estricta: una unidad se abre al completar toda la anterior. */
export function isUnitUnlocked(units: Unit[], unitIndex: number, completed: Completed): boolean {
  if (unitIndex === 0) return true;
  return units.slice(0, unitIndex).every((u) => isUnitCompleted(u, completed));
}

/** Una lección se abre al completar la anterior de su unidad (y con la unidad abierta). */
export function isLessonUnlocked(
  units: Unit[],
  unitIndex: number,
  lessonIndex: number,
  completed: Completed,
): boolean {
  if (!isUnitUnlocked(units, unitIndex, completed)) return false;
  if (lessonIndex === 0) return true;
  const prev = units[unitIndex].lessons[lessonIndex - 1];
  return completed[prev.id] !== undefined;
}

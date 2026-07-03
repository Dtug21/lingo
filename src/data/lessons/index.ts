import type { Lesson, Unit } from '../../types';
import { unit1 } from './unit1-greetings';
import { unit2 } from './unit2-food';
import { unit3 } from './unit3-travel';
import { unit4 } from './unit4-work';
import { unit5 } from './unit5-weather';
import { unit6 } from './unit6-conversation';
import { unit7 } from './unit7-professional';

export const UNITS: Unit[] = [unit1, unit2, unit3, unit4, unit5, unit6, unit7];

export function findUnit(unitId: string): Unit | undefined {
  return UNITS.find((u) => u.id === unitId);
}

export function findLesson(
  unitId: string,
  lessonId: string,
): { unit: Unit; lesson: Lesson } | undefined {
  const unit = findUnit(unitId);
  const lessonFound = unit?.lessons.find((l) => l.id === lessonId);
  return unit && lessonFound ? { unit, lesson: lessonFound } : undefined;
}

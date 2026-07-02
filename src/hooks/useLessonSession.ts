import { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Exercise, Lesson, LessonResult, Unit } from '../types';
import { calcLessonXp } from '../lib/xp';
import { achievementById } from '../data/achievements';
import { useProgressStore } from '../store/useProgressStore';

export type SessionPhase = 'answering' | 'feedback' | 'failed';

interface QueueItem {
  exercise: Exercise;
  /** Distingue instancias re-encoladas para resetear el estado del componente. */
  attempt: number;
}

export interface LessonSession {
  current: QueueItem | null;
  phase: SessionPhase;
  lastCorrect: boolean;
  /** Progreso de la barra: aciertos / total de ítems en cola. */
  done: number;
  total: number;
  hearts: number;
  submit: (correct: boolean) => void;
  /** Avanza tras el feedback; al terminar registra la lección y navega a /results. */
  next: () => void;
}

/**
 * Máquina de estados de una lección: cola de ejercicios → responder →
 * feedback → los fallados se re-encolan al final → resultados.
 * Si los corazones llegan a 0 la sesión termina en fallo.
 */
export function useLessonSession(unit: Unit, lesson: Lesson): LessonSession {
  const navigate = useNavigate();
  const loseOneHeart = useProgressStore((s) => s.loseOneHeart);
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const hearts = useProgressStore((s) => s.hearts.count);

  const [queue, setQueue] = useState<QueueItem[]>(() =>
    lesson.exercises.map((exercise) => ({ exercise, attempt: 0 })),
  );
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<SessionPhase>('answering');
  const [lastCorrect, setLastCorrect] = useState(false);
  const failedIds = useRef(new Set<string>());
  const finishedRef = useRef(false);

  const current = index < queue.length ? queue[index] : null;

  const submit = useCallback(
    (correct: boolean) => {
      if (phase !== 'answering' || current === null) return;
      setLastCorrect(correct);
      if (correct) {
        setPhase('feedback');
        return;
      }
      failedIds.current.add(current.exercise.id);
      // re-encolar el ejercicio fallado al final
      setQueue((q) => [...q, { exercise: current.exercise, attempt: current.attempt + 1 }]);
      loseOneHeart();
      // hearts aún no refleja la pérdida en este render: 1 significa que quedó en 0
      setPhase(hearts <= 1 ? 'failed' : 'feedback');
    },
    [phase, current, hearts, loseOneHeart],
  );

  const next = useCallback(() => {
    if (phase !== 'feedback' || finishedRef.current) return;
    const nextIndex = index + 1;
    if (nextIndex < queue.length) {
      setIndex(nextIndex);
      setPhase('answering');
      return;
    }
    finishedRef.current = true;
    const totalExercises = lesson.exercises.length;
    const mistakes = failedIds.current.size;
    const perfect = mistakes === 0;
    const xpEarned = calcLessonXp(totalExercises, mistakes);
    const newIds = completeLesson({ lessonId: lesson.id, xpEarned, perfect });
    const result: LessonResult = {
      unitId: unit.id,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      totalExercises,
      mistakes,
      xpEarned,
      perfect,
      failed: false,
      newAchievements: newIds
        .map(achievementById)
        .filter((a): a is NonNullable<typeof a> => a !== undefined),
    };
    navigate('/results', { state: result, replace: true });
  }, [phase, index, queue.length, lesson, unit.id, completeLesson, navigate]);

  const done = useMemo(() => {
    // aciertos acumulados = ítems ya superados (los fallados se re-encolan)
    return index + (phase === 'feedback' && lastCorrect ? 1 : 0);
  }, [index, phase, lastCorrect]);

  return { current, phase, lastCorrect, done, total: queue.length, hearts, submit, next };
}

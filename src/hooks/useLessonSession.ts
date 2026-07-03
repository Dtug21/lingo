import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Exercise, LessonResult, SessionMode } from '../types';
import { calcLessonXp } from '../lib/xp';
import { REVIEW_XP_PER_EXERCISE } from '../lib/review';
import { MAX_HEARTS } from '../lib/hearts';
import { achievementById } from '../data/achievements';
import { useProgressStore } from '../store/useProgressStore';

export type SessionPhase = 'answering' | 'feedback' | 'failed';

interface QueueItem {
  exercise: Exercise;
  /** Distingue instancias re-encoladas para resetear el estado del componente. */
  attempt: number;
}

export interface SessionConfig {
  mode: SessionMode;
  exercises: Exercise[];
  /** Metadatos para el resultado (en repaso: título genérico). */
  unitId: string;
  lessonId: string;
  title: string;
}

export interface LessonSession {
  mode: SessionMode;
  current: QueueItem | null;
  phase: SessionPhase;
  lastCorrect: boolean;
  /** Progreso de la barra: ítems superados / total de ítems en cola. */
  done: number;
  total: number;
  hearts: number;
  submit: (correct: boolean) => void;
  /** Avanza tras el feedback; al terminar registra la sesión y navega a /results. */
  next: () => void;
}

/**
 * Máquina de estados de una sesión de ejercicios: cola → responder →
 * feedback → los fallados se re-encolan al final → resultados.
 * - Modo `lesson`: los errores cuestan corazones; 0 corazones = sesión fallida.
 * - Modo `review`: sin corazones; al terminar se agenda la repetición espaciada
 *   y se recupera un corazón.
 */
export function useLessonSession(config: SessionConfig): LessonSession {
  const navigate = useNavigate();
  const loseOneHeart = useProgressStore((s) => s.loseOneHeart);
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const completeReview = useProgressStore((s) => s.completeReview);
  const hearts = useProgressStore((s) => s.hearts.count);

  const [queue, setQueue] = useState<QueueItem[]>(() =>
    config.exercises.map((exercise) => ({ exercise, attempt: 0 })),
  );
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<SessionPhase>('answering');
  const [lastCorrect, setLastCorrect] = useState(false);
  /** Acierto al PRIMER intento por ejercicio (define XP y agenda de repaso). */
  const firstTryResults = useRef(new Map<string, boolean>());
  const finishedRef = useRef(false);

  const current = index < queue.length ? queue[index] : null;

  const submit = useCallback(
    (correct: boolean) => {
      if (phase !== 'answering' || current === null) return;
      setLastCorrect(correct);
      const id = current.exercise.id;
      if (!firstTryResults.current.has(id)) firstTryResults.current.set(id, correct);

      if (correct) {
        setPhase('feedback');
        return;
      }
      // re-encolar el ejercicio fallado al final
      setQueue((q) => [...q, { exercise: current.exercise, attempt: current.attempt + 1 }]);
      if (config.mode === 'lesson') {
        loseOneHeart();
        // hearts aún no refleja la pérdida en este render: 1 significa que quedó en 0
        setPhase(hearts <= 1 ? 'failed' : 'feedback');
      } else {
        setPhase('feedback');
      }
    },
    [phase, current, hearts, loseOneHeart, config.mode],
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

    const totalExercises = config.exercises.length;
    const failedIds = [...firstTryResults.current.entries()]
      .filter(([, correct]) => !correct)
      .map(([id]) => id);
    const mistakes = failedIds.length;
    const perfect = mistakes === 0;

    let xpEarned: number;
    let newIds: string[];
    let heartRestored = false;

    if (config.mode === 'lesson') {
      xpEarned = calcLessonXp(totalExercises, mistakes);
      newIds = completeLesson({
        lessonId: config.lessonId,
        xpEarned,
        perfect,
        failedExerciseIds: failedIds,
      });
    } else {
      xpEarned = (totalExercises - mistakes) * REVIEW_XP_PER_EXERCISE;
      heartRestored = hearts < MAX_HEARTS;
      newIds = completeReview({
        xpEarned,
        results: Object.fromEntries(firstTryResults.current),
      });
    }

    const result: LessonResult = {
      mode: config.mode,
      unitId: config.unitId,
      lessonId: config.lessonId,
      lessonTitle: config.title,
      totalExercises,
      mistakes,
      xpEarned,
      perfect,
      failed: false,
      heartRestored,
      newAchievements: newIds
        .map(achievementById)
        .filter((a): a is NonNullable<typeof a> => a !== undefined),
    };
    navigate('/results', { state: result, replace: true });
  }, [phase, index, queue.length, config, hearts, completeLesson, completeReview, navigate]);

  return {
    mode: config.mode,
    current,
    phase,
    lastCorrect,
    done: index + (phase === 'feedback' && lastCorrect ? 1 : 0),
    total: queue.length,
    hearts,
    submit,
    next,
  };
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Exercise } from '../types';
import { UNITS } from '../data/lessons';
import { buildReviewSession } from '../lib/review';
import { toLocalDateKey } from '../lib/dates';
import { useProgressStore } from '../store/useProgressStore';
import { useLessonSession } from '../hooks/useLessonSession';
import { SessionRunner } from '../components/session/SessionRunner';
import { ChunkyButton } from '../components/ui/ChunkyButton';

export function ReviewPage() {
  // la sesión se arma UNA vez al montar (no debe cambiar mientras se responde)
  const [exercises] = useState<Exercise[]>(() => {
    const { completedLessons, reviewRecords } = useProgressStore.getState();
    return buildReviewSession(UNITS, completedLessons, reviewRecords, toLocalDateKey(new Date()));
  });

  if (exercises.length === 0) return <NothingToReview />;
  return <ReviewSession exercises={exercises} />;
}

function NothingToReview() {
  const navigate = useNavigate();
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-4 p-6 text-center">
      <span className="text-6xl" aria-hidden="true">
        🌱
      </span>
      <h1 className="text-2xl font-black text-gray-800">Nada que repasar todavía</h1>
      <p className="font-semibold text-gray-500">
        Completa tu primera lección y el repaso inteligente empezará a programar la práctica de lo
        que más te cueste.
      </p>
      <ChunkyButton onClick={() => navigate('/')}>Ir al mapa</ChunkyButton>
    </main>
  );
}

function ReviewSession({ exercises }: { exercises: Exercise[] }) {
  const session = useLessonSession({
    mode: 'review',
    exercises,
    unitId: 'review',
    lessonId: 'review',
    title: 'Repaso inteligente',
  });
  return <SessionRunner session={session} />;
}

import { useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import type { Lesson, Unit } from '../types';
import { findLesson } from '../data/lessons';
import { useLessonSession } from '../hooks/useLessonSession';
import { useProgressStore } from '../store/useProgressStore';
import { useNow } from '../hooks/useNow';
import { msUntilNextHeart } from '../lib/hearts';
import { SessionRunner } from '../components/session/SessionRunner';
import { ChunkyButton } from '../components/ui/ChunkyButton';

export function LessonPage() {
  const { unitId = '', lessonId = '' } = useParams();
  const found = findLesson(unitId, lessonId);
  const hearts = useProgressStore((s) => s.hearts.count);
  const syncHearts = useProgressStore((s) => s.syncHearts);

  useEffect(() => {
    syncHearts();
  }, [syncHearts]);

  if (!found) return <Navigate to="/" replace />;
  if (hearts === 0) return <NoHeartsScreen />;

  return <LessonSession unit={found.unit} lesson={found.lesson} />;
}

function NoHeartsScreen() {
  const navigate = useNavigate();
  const heartsState = useProgressStore((s) => s.hearts);
  const syncHearts = useProgressStore((s) => s.syncHearts);
  const now = useNow(1000);
  const ms = msUntilNextHeart(heartsState, now);

  useEffect(() => {
    syncHearts();
  }, [now, syncHearts]);

  const minutes = ms === null ? 0 : Math.floor(ms / 60000);
  const seconds = ms === null ? 0 : Math.floor((ms % 60000) / 1000);

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-4 p-6 text-center">
      <span className="text-6xl" aria-hidden="true">
        💔
      </span>
      <h1 className="text-2xl font-black text-gray-800">¡Te quedaste sin corazones!</h1>
      <p className="font-semibold text-gray-500">
        El próximo corazón llega en{' '}
        <span className="font-extrabold text-coral-500">
          {minutes}:{String(seconds).padStart(2, '0')}
        </span>
        . También puedes recuperar uno completando un repaso.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <ChunkyButton onClick={() => navigate('/review')}>Hacer un repaso</ChunkyButton>
        <ChunkyButton variant="neutral" onClick={() => navigate('/')}>
          Volver al mapa
        </ChunkyButton>
      </div>
    </main>
  );
}

function LessonSession({ unit, lesson }: { unit: Unit; lesson: Lesson }) {
  const session = useLessonSession({
    mode: 'lesson',
    exercises: lesson.exercises,
    unitId: unit.id,
    lessonId: lesson.id,
    title: lesson.title,
  });
  return <SessionRunner session={session} />;
}

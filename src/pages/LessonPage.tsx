import { useCallback, useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import type { Lesson, Unit } from '../types';
import { findLesson } from '../data/lessons';
import { useLessonSession } from '../hooks/useLessonSession';
import { useProgressStore } from '../store/useProgressStore';
import { useNow } from '../hooks/useNow';
import { msUntilNextHeart } from '../lib/hearts';
import { correctAnswerText, instructionFor } from '../lib/answers';
import { ExerciseRenderer } from '../components/exercises/ExerciseRenderer';
import type { ExerciseHandle } from '../components/exercises/shared';
import { ChunkyButton } from '../components/ui/ChunkyButton';
import { ProgressBar } from '../components/ui/ProgressBar';
import { HeartsDisplay } from '../components/ui/HeartsDisplay';

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
        . Vuelve en un rato para seguir practicando.
      </p>
      <ChunkyButton onClick={() => navigate('/')}>Volver al mapa</ChunkyButton>
    </main>
  );
}

function LessonSession({ unit, lesson }: { unit: Unit; lesson: Lesson }) {
  const navigate = useNavigate();
  const session = useLessonSession(unit, lesson);
  const [ready, setReady] = useState(false);
  const handleRef = useRef<ExerciseHandle>(null);

  const instanceKey = session.current
    ? `${session.current.exercise.id}-${session.current.attempt}`
    : 'none';

  useEffect(() => {
    setReady(false);
  }, [instanceKey]);

  const check = useCallback(() => {
    const correct = handleRef.current?.check() ?? false;
    session.submit(correct);
  }, [session]);

  // Enter comprueba o continúa (accesibilidad por teclado)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      if (session.phase === 'answering' && ready) check();
      else if (session.phase === 'feedback') session.next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [session, ready, check]);

  const quit = () => {
    if (window.confirm('¿Seguro que quieres salir? Perderás el progreso de esta lección.')) {
      navigate('/');
    }
  };

  if (session.phase === 'failed') {
    return (
      <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-4 p-6 text-center">
        <span className="text-6xl" aria-hidden="true">
          💔
        </span>
        <h1 className="text-2xl font-black text-gray-800">Sin corazones…</h1>
        <p className="font-semibold text-gray-500">
          Se acabaron tus vidas a mitad de la lección. Los corazones se regeneran con el tiempo:
          ¡vuelve pronto e inténtalo de nuevo!
        </p>
        <ChunkyButton onClick={() => navigate('/')}>Volver al mapa</ChunkyButton>
      </main>
    );
  }

  const exercise = session.current?.exercise ?? null;

  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col p-4">
      <header className="flex items-center gap-4 py-2">
        <button
          type="button"
          onClick={quit}
          aria-label="Salir de la lección"
          className="text-2xl font-black text-gray-300 transition-colors hover:text-gray-500 cursor-pointer"
        >
          ✕
        </button>
        <ProgressBar value={session.done} max={session.total} label="Progreso de la lección" />
        <HeartsDisplay count={session.hearts} compact />
      </header>

      {exercise && (
        <main className="flex flex-1 flex-col py-6" key={instanceKey}>
          <p className="mb-3 text-sm font-extrabold uppercase tracking-widest text-brand-600">
            {instructionFor(exercise)}
          </p>
          <ExerciseRenderer
            exercise={exercise}
            disabled={session.phase !== 'answering'}
            onReadyChange={setReady}
            handleRef={handleRef}
          />
        </main>
      )}

      <footer className="sticky bottom-0 -mx-4 mt-auto">
        {session.phase === 'feedback' && exercise ? (
          <div
            role="status"
            aria-live="assertive"
            className={`animate-slide-up p-4 pb-6 ${
              session.lastCorrect ? 'bg-brand-100' : 'bg-coral-100'
            }`}
          >
            <div className="mx-auto flex max-w-xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p
                  className={`text-lg font-black ${
                    session.lastCorrect ? 'text-brand-700' : 'text-coral-700'
                  }`}
                >
                  {session.lastCorrect ? '¡Correcto! 🎉' : 'Incorrecto 😅'}
                </p>
                {!session.lastCorrect && (
                  <p className="text-sm font-bold text-coral-600">
                    Respuesta correcta: {correctAnswerText(exercise)}
                  </p>
                )}
              </div>
              <ChunkyButton
                variant={session.lastCorrect ? 'primary' : 'danger'}
                onClick={session.next}
                autoFocus
              >
                Continuar
              </ChunkyButton>
            </div>
          </div>
        ) : (
          <div className="border-t-2 border-gray-100 bg-white p-4 pb-6">
            <div className="mx-auto max-w-xl">
              <ChunkyButton className="w-full" disabled={!ready} onClick={check}>
                Comprobar
              </ChunkyButton>
            </div>
          </div>
        )}
      </footer>
    </div>
  );
}

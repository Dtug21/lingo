import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import type { LessonResult } from '../types';
import { PERFECT_LESSON_BONUS } from '../lib/xp';
import { ChunkyButton } from '../components/ui/ChunkyButton';
import { Confetti } from '../components/ui/Confetti';

function isLessonResult(value: unknown): value is LessonResult {
  return (
    typeof value === 'object' &&
    value !== null &&
    'xpEarned' in value &&
    'lessonTitle' in value &&
    'totalExercises' in value
  );
}

export function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result: unknown = location.state;

  if (!isLessonResult(result)) return <Navigate to="/" replace />;

  const accuracy = Math.round(
    ((result.totalExercises - result.mistakes) / result.totalExercises) * 100,
  );

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-6 p-6 text-center">
      <Confetti />

      <div className="animate-pop text-7xl" aria-hidden="true">
        {result.perfect ? '🏆' : '🎉'}
      </div>
      <div>
        <h1 className="text-3xl font-black text-gray-800">
          {result.perfect ? '¡Lección perfecta!' : '¡Lección completada!'}
        </h1>
        <p className="mt-1 font-bold text-gray-400">{result.lessonTitle}</p>
      </div>

      <div className="flex w-full max-w-sm gap-3">
        <div className="flex-1 rounded-2xl border-2 border-sunshine-400 bg-sunshine-100 p-4">
          <p className="text-xs font-extrabold uppercase tracking-widest text-sunshine-600">
            XP ganado
          </p>
          <p className="text-3xl font-black text-gray-800">+{result.xpEarned}</p>
          {result.perfect && (
            <p className="text-xs font-bold text-sunshine-600">
              incluye +{PERFECT_LESSON_BONUS} de bonus
            </p>
          )}
        </div>
        <div className="flex-1 rounded-2xl border-2 border-brand-400 bg-brand-50 p-4">
          <p className="text-xs font-extrabold uppercase tracking-widest text-brand-600">
            Precisión
          </p>
          <p className="text-3xl font-black text-gray-800">{Math.max(0, accuracy)}%</p>
          <p className="text-xs font-bold text-brand-600">
            {result.mistakes === 0
              ? 'sin errores'
              : `${result.mistakes} ${result.mistakes === 1 ? 'error' : 'errores'}`}
          </p>
        </div>
      </div>

      {result.newAchievements.length > 0 && (
        <section
          aria-label="Logros desbloqueados"
          className="w-full max-w-sm rounded-2xl border-2 border-violet-300 bg-violet-50 p-4"
        >
          <h2 className="mb-2 text-xs font-extrabold uppercase tracking-widest text-violet-500">
            ¡Logros desbloqueados!
          </h2>
          <ul className="flex flex-col gap-2">
            {result.newAchievements.map((a) => (
              <li key={a.id} className="animate-pop flex items-center gap-3 text-left">
                <span className="text-3xl" aria-hidden="true">
                  {a.icon}
                </span>
                <div>
                  <p className="font-black text-gray-800">{a.title}</p>
                  <p className="text-sm font-semibold text-gray-500">{a.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <ChunkyButton className="w-full max-w-sm" onClick={() => navigate('/')}>
        Continuar
      </ChunkyButton>
    </main>
  );
}

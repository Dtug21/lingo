import { useProgressStore } from '../store/useProgressStore';
import { UNITS } from '../data/lessons';
import { ACHIEVEMENTS } from '../data/achievements';
import { levelForXp, levelProgress } from '../lib/xp';
import { displayStreak } from '../lib/streak';
import { toLocalDateKey } from '../lib/dates';
import { msUntilNextHeart, MAX_HEARTS } from '../lib/hearts';
import { useNow } from '../hooks/useNow';
import { TopBar } from '../components/ui/TopBar';
import { HeartsDisplay } from '../components/ui/HeartsDisplay';
import { ChunkyButton } from '../components/ui/ChunkyButton';

export function ProfilePage() {
  const { xp, streak, hearts, completedLessons, unlockedAchievements, resetProgress } =
    useProgressStore();
  const now = useNow(1000);

  const level = levelForXp(xp);
  const progress = levelProgress(xp);
  const streakToday = displayStreak(streak, toLocalDateKey(new Date()));
  const lessonsDone = Object.keys(completedLessons).length;
  const perfectCount = Object.values(completedLessons).filter((r) => r.perfect).length;
  const totalLessons = UNITS.reduce((sum, u) => sum + u.lessons.length, 0);
  const ms = msUntilNextHeart(hearts, now);

  const handleReset = () => {
    if (window.confirm('¿Borrar TODO tu progreso? Esta acción no se puede deshacer.')) {
      resetProgress();
    }
  };

  return (
    <>
      <TopBar />
      <main className="mx-auto flex max-w-xl flex-col gap-5 px-4 pb-16 pt-6">
        <h1 className="text-2xl font-black text-gray-800">Tu progreso</h1>

        {/* Nivel */}
        <section
          aria-label="Nivel"
          className="rounded-3xl border-b-4 border-brand-700 bg-brand-500 p-5 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-brand-100">
                Nivel
              </p>
              <p className="text-4xl font-black">{level}</p>
            </div>
            <p className="text-sm font-bold text-brand-100">
              {progress.current} / {progress.needed} XP para el nivel {level + 1}
            </p>
          </div>
          <div
            role="progressbar"
            aria-label="Progreso al siguiente nivel"
            aria-valuenow={progress.current}
            aria-valuemin={0}
            aria-valuemax={progress.needed}
            className="mt-3 h-3 overflow-hidden rounded-full bg-brand-700/50"
          >
            <div
              className="h-full rounded-full bg-sunshine-400 transition-all duration-500"
              style={{ width: `${progress.ratio * 100}%` }}
            />
          </div>
        </section>

        {/* Racha y vidas */}
        <div className="grid grid-cols-2 gap-4">
          <section
            aria-label="Racha diaria"
            className="rounded-3xl border-2 border-sunshine-400 bg-sunshine-100 p-4"
          >
            <p className="text-xs font-extrabold uppercase tracking-widest text-sunshine-600">
              Racha
            </p>
            <p className="text-3xl font-black text-gray-800">
              <span aria-hidden="true">🔥</span> {streakToday}
              <span className="text-base font-bold text-gray-500"> días</span>
            </p>
            <p className="mt-1 text-xs font-bold text-gray-500">
              <span aria-hidden="true">🧊</span> {streak.freezes}{' '}
              {streak.freezes === 1 ? 'protector' : 'protectores'} de racha
            </p>
          </section>

          <section
            aria-label="Vidas"
            className="rounded-3xl border-2 border-coral-300 bg-coral-100/60 p-4"
          >
            <p className="text-xs font-extrabold uppercase tracking-widest text-coral-600">
              Vidas
            </p>
            <div className="mt-2">
              <HeartsDisplay count={hearts.count} />
            </div>
            <p className="mt-1 text-xs font-bold text-gray-500">
              {hearts.count === MAX_HEARTS || ms === null
                ? 'Todas llenas'
                : `Próxima en ${Math.floor(ms / 60000)}:${String(
                    Math.floor((ms % 60000) / 1000),
                  ).padStart(2, '0')}`}
            </p>
          </section>
        </div>

        {/* Estadísticas */}
        <section aria-label="Estadísticas" className="grid grid-cols-3 gap-3">
          {[
            { label: 'XP total', value: xp, icon: '⭐' },
            { label: 'Lecciones', value: `${lessonsDone}/${totalLessons}`, icon: '📗' },
            { label: 'Perfectas', value: perfectCount, icon: '💎' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border-2 border-gray-200 bg-white p-3 text-center"
            >
              <p className="text-2xl" aria-hidden="true">
                {stat.icon}
              </p>
              <p className="text-xl font-black text-gray-800">{stat.value}</p>
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                {stat.label}
              </p>
            </div>
          ))}
        </section>

        {/* Logros */}
        <section aria-label="Logros">
          <h2 className="mb-3 text-lg font-black text-gray-800">
            Logros · {unlockedAchievements.length}/{ACHIEVEMENTS.length}
          </h2>
          <ul className="grid grid-cols-3 gap-3">
            {ACHIEVEMENTS.map((a) => {
              const earned = unlockedAchievements.includes(a.id);
              return (
                <li
                  key={a.id}
                  title={a.description}
                  className={`rounded-2xl border-2 p-3 text-center ${
                    earned
                      ? 'border-violet-300 bg-violet-50'
                      : 'border-gray-200 bg-white opacity-50 grayscale'
                  }`}
                >
                  <p className="text-3xl" aria-hidden="true">
                    {a.icon}
                  </p>
                  <p className="mt-1 text-xs font-black text-gray-700">{a.title}</p>
                  <p className="text-[10px] font-semibold leading-tight text-gray-400">
                    {a.description}
                  </p>
                  <span className="sr-only">{earned ? 'Desbloqueado' : 'Bloqueado'}</span>
                </li>
              );
            })}
          </ul>
        </section>

        <ChunkyButton variant="danger" onClick={handleReset} className="mt-4">
          Reiniciar progreso
        </ChunkyButton>
      </main>
    </>
  );
}

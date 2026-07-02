import { Link, useLocation } from 'react-router-dom';
import { useProgressStore } from '../../store/useProgressStore';
import { displayStreak } from '../../lib/streak';
import { toLocalDateKey } from '../../lib/dates';

/** Barra superior con logo, stats rápidas y navegación Home/Perfil. */
export function TopBar() {
  const xp = useProgressStore((s) => s.xp);
  const hearts = useProgressStore((s) => s.hearts.count);
  const streak = useProgressStore((s) => s.streak);
  const location = useLocation();
  const streakToday = displayStreak(streak, toLocalDateKey(new Date()));

  return (
    <header className="sticky top-0 z-40 border-b-2 border-gray-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-2xl font-black tracking-tight text-brand-500">
          lingo<span aria-hidden="true">🦜</span>
        </Link>
        <div className="flex items-center gap-4 text-sm font-extrabold">
          <span className="flex items-center gap-1 text-sunshine-600" title="Racha diaria">
            <span aria-hidden="true">🔥</span>
            <span aria-label={`Racha de ${streakToday} días`}>{streakToday}</span>
          </span>
          <span className="flex items-center gap-1 text-sunshine-600" title="XP total">
            <span aria-hidden="true">⭐</span>
            <span aria-label={`${xp} puntos de experiencia`}>{xp}</span>
          </span>
          <span className="flex items-center gap-1 text-coral-500" title="Vidas">
            <span aria-hidden="true">❤️</span>
            <span aria-label={`${hearts} vidas`}>{hearts}</span>
          </span>
          <Link
            to="/profile"
            aria-label="Ver perfil y progreso"
            aria-current={location.pathname === '/profile' ? 'page' : undefined}
            className={`rounded-xl border-2 border-b-4 px-3 py-1 transition-colors ${
              location.pathname === '/profile'
                ? 'border-brand-400 bg-brand-50 text-brand-600'
                : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
            }`}
          >
            <span aria-hidden="true">👤</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

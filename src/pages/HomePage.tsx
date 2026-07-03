import { useNavigate } from 'react-router-dom';
import type { Lesson, Unit } from '../types';
import { UNITS } from '../data/lessons';
import { useProgressStore } from '../store/useProgressStore';
import { isLessonUnlocked, isUnitUnlocked } from '../lib/unlock';
import { countDue } from '../lib/review';
import { toLocalDateKey } from '../lib/dates';
import { UNIT_PALETTE } from '../components/ui/unitColors';
import { TopBar } from '../components/ui/TopBar';

/** Desplazamiento horizontal en zigzag de los nodos del camino. */
const ZIGZAG = [0, 44, 70, 44, 0, -44];

export function HomePage() {
  const completed = useProgressStore((s) => s.completedLessons);

  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-xl px-4 pb-16">
        <h1 className="sr-only">Mapa de unidades</h1>
        <DailyPanel />
        {UNITS.map((unit, unitIndex) => (
          <UnitSection
            key={unit.id}
            unit={unit}
            unitIndex={unitIndex}
            unlocked={isUnitUnlocked(UNITS, unitIndex, completed)}
          />
        ))}
      </main>
    </>
  );
}

/** Meta diaria de XP + acceso al repaso inteligente. */
function DailyPanel() {
  const navigate = useNavigate();
  const dailyXp = useProgressStore((s) => s.dailyXp);
  const dailyGoal = useProgressStore((s) => s.dailyGoal);
  const reviewRecords = useProgressStore((s) => s.reviewRecords);
  const completedLessons = useProgressStore((s) => s.completedLessons);

  const todayKey = toLocalDateKey(new Date());
  const todayXp = dailyXp.date === todayKey ? dailyXp.amount : 0;
  const ratio = Math.min(1, todayXp / dailyGoal);
  const due = countDue(reviewRecords, todayKey);
  const hasContent = Object.keys(completedLessons).length > 0;

  return (
    <section aria-label="Meta diaria y repaso" className="mt-4 flex flex-col gap-3 sm:flex-row">
      <div className="flex-1 rounded-3xl border-2 border-sunshine-400 bg-sunshine-100 p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-extrabold uppercase tracking-widest text-sunshine-600">
            Meta diaria
          </p>
          <p className="text-sm font-black text-gray-700">
            {ratio >= 1 ? '¡Cumplida! 🎉' : `${todayXp}/${dailyGoal} XP`}
          </p>
        </div>
        <div
          role="progressbar"
          aria-label="Progreso de la meta diaria"
          aria-valuenow={todayXp}
          aria-valuemin={0}
          aria-valuemax={dailyGoal}
          className="mt-2 h-3 overflow-hidden rounded-full bg-sunshine-300/50"
        >
          <div
            className="h-full rounded-full bg-sunshine-500 transition-all duration-500"
            style={{ width: `${ratio * 100}%` }}
          />
        </div>
      </div>

      {hasContent && (
        <button
          type="button"
          onClick={() => navigate('/review')}
          className="flex items-center justify-between gap-3 rounded-3xl border-2 border-b-4 border-teal-500 bg-teal-400 p-4 text-left text-white transition-all duration-100 hover:bg-teal-300 active:translate-y-[2px] active:border-b-2 cursor-pointer sm:w-44"
        >
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-teal-50">
              Repaso
            </p>
            <p className="text-sm font-black">
              {due > 0 ? `${due} pendiente${due === 1 ? '' : 's'}` : 'Práctica libre'}
            </p>
            <p className="text-xs font-bold text-teal-50">+1 ❤️ al terminar</p>
          </div>
          <span className="text-3xl" aria-hidden="true">
            🧠
          </span>
        </button>
      )}
    </section>
  );
}

function UnitSection({
  unit,
  unitIndex,
  unlocked,
}: {
  unit: Unit;
  unitIndex: number;
  unlocked: boolean;
}) {
  const completed = useProgressStore((s) => s.completedLessons);
  const palette = UNIT_PALETTE[unit.color];
  const doneCount = unit.lessons.filter((l) => completed[l.id] !== undefined).length;

  return (
    <section aria-label={`Unidad ${unitIndex + 1}: ${unit.title}`} className="mt-8">
      <div
        className={`rounded-3xl border-b-4 p-5 text-white ${
          unlocked ? palette.banner : 'border-gray-300 bg-gray-200'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className={unlocked ? '' : 'text-gray-400'}>
            <p className={`text-xs font-extrabold uppercase tracking-widest ${unlocked ? palette.progressText : ''}`}>
              Unidad {unitIndex + 1} · {doneCount}/{unit.lessons.length} lecciones
            </p>
            <h2 className="text-xl font-black">{unit.title}</h2>
            <p className={`text-sm font-semibold ${unlocked ? palette.progressText : ''}`}>
              {unit.description}
            </p>
          </div>
          <span className="text-4xl" aria-hidden="true">
            {unlocked ? unit.icon : '🔒'}
          </span>
        </div>
      </div>

      <ol className="mt-6 flex flex-col items-center gap-5" aria-label="Lecciones">
        {unit.lessons.map((lessonItem, lessonIndex) => (
          <LessonNode
            key={lessonItem.id}
            unit={unit}
            unitIndex={unitIndex}
            lesson={lessonItem}
            lessonIndex={lessonIndex}
          />
        ))}
      </ol>
    </section>
  );
}

function LessonNode({
  unit,
  unitIndex,
  lesson,
  lessonIndex,
}: {
  unit: Unit;
  unitIndex: number;
  lesson: Lesson;
  lessonIndex: number;
}) {
  const navigate = useNavigate();
  const completed = useProgressStore((s) => s.completedLessons);
  const palette = UNIT_PALETTE[unit.color];

  const record = completed[lesson.id];
  const unlocked = isLessonUnlocked(UNITS, unitIndex, lessonIndex, completed);
  const isCurrent = unlocked && record === undefined;
  const offset = ZIGZAG[lessonIndex % ZIGZAG.length];

  const stateLabel = record
    ? record.perfect
      ? 'completada sin errores'
      : 'completada'
    : unlocked
      ? 'disponible'
      : 'bloqueada';

  return (
    <li style={{ transform: `translateX(${offset}px)` }} className="flex flex-col items-center">
      {isCurrent && (
        <span className="animate-bounce-soft mb-1 rounded-xl border-2 border-gray-200 bg-white px-3 py-1 text-xs font-black uppercase tracking-widest text-brand-600 shadow-sm">
          Empezar
        </span>
      )}
      <button
        type="button"
        disabled={!unlocked}
        onClick={() => navigate(`/lesson/${unit.id}/${lesson.id}`)}
        aria-label={`Lección ${lessonIndex + 1}: ${lesson.title} (${stateLabel})`}
        className={`flex h-16 w-16 items-center justify-center rounded-full border-b-8 text-2xl transition-all duration-100 ${
          unlocked
            ? `${palette.node} cursor-pointer text-white active:translate-y-[4px] active:border-b-4`
            : 'cursor-not-allowed border-gray-300 bg-gray-200 text-gray-400'
        }`}
      >
        <span aria-hidden="true">{record ? (record.perfect ? '👑' : '✓') : unlocked ? unit.icon : '🔒'}</span>
      </button>
      <span className={`mt-1 max-w-28 text-center text-xs font-bold ${unlocked ? 'text-gray-500' : 'text-gray-300'}`}>
        {lesson.title}
      </span>
    </li>
  );
}

import { useNavigate } from 'react-router-dom';
import type { Lesson, Unit } from '../types';
import { UNITS } from '../data/lessons';
import { useProgressStore } from '../store/useProgressStore';
import { isLessonUnlocked, isUnitUnlocked } from '../lib/unlock';
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

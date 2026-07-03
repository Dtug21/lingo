import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { HeartsState, LessonRecord, ReviewRecord, StreakState } from '../types';
import { INITIAL_HEARTS, MAX_HEARTS, applyRegen, loseHeart } from '../lib/hearts';
import { INITIAL_STREAK, recordActivity } from '../lib/streak';
import { checkNewAchievements } from '../lib/achievements';
import { toLocalDateKey } from '../lib/dates';
import { recordAfterMistake, recordAfterReview } from '../lib/review';
import { UNITS } from '../data/lessons';

export const DEFAULT_DAILY_GOAL = 30;

interface CompleteLessonInput {
  lessonId: string;
  xpEarned: number;
  perfect: boolean;
  /** Ids de ejercicios fallados: entran al ciclo de repaso espaciado. */
  failedExerciseIds: string[];
}

interface CompleteReviewInput {
  xpEarned: number;
  /** Resultado por ejercicio repasado (id → acierto). */
  results: Record<string, boolean>;
}

interface DailyXp {
  date: string;
  amount: number;
}

interface ProgressState {
  xp: number;
  hearts: HeartsState;
  streak: StreakState;
  completedLessons: Record<string, LessonRecord>;
  unlockedAchievements: string[];
  reviewRecords: Record<string, ReviewRecord>;
  reviewsCompleted: number;
  dailyXp: DailyXp;
  dailyGoal: number;

  /** Sincroniza la regeneración perezosa de corazones. Idempotente. */
  syncHearts: () => void;
  loseOneHeart: () => void;
  /** Registra la lección terminada: XP, racha, repaso, logros. Devuelve ids de logros nuevos. */
  completeLesson: (input: CompleteLessonInput) => string[];
  /** Registra un repaso terminado: XP, agenda espaciada, +1 corazón. Devuelve ids de logros nuevos. */
  completeReview: (input: CompleteReviewInput) => string[];
  setDailyGoal: (goal: number) => void;
  resetProgress: () => void;
}

function addDailyXp(current: DailyXp, amount: number, todayKey: string): DailyXp {
  return current.date === todayKey
    ? { date: todayKey, amount: current.amount + amount }
    : { date: todayKey, amount };
}

const INITIAL_FIELDS = {
  xp: 0,
  hearts: INITIAL_HEARTS,
  streak: INITIAL_STREAK,
  completedLessons: {},
  unlockedAchievements: [],
  reviewRecords: {},
  reviewsCompleted: 0,
  dailyXp: { date: '', amount: 0 },
  dailyGoal: DEFAULT_DAILY_GOAL,
} satisfies Partial<ProgressState>;

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...INITIAL_FIELDS,

      syncHearts: () => {
        const { hearts } = get();
        const next = applyRegen(hearts, Date.now());
        if (next !== hearts) set({ hearts: next });
      },

      loseOneHeart: () => {
        set((s) => ({ hearts: loseHeart(s.hearts, Date.now()) }));
      },

      completeLesson: ({ lessonId, xpEarned, perfect, failedExerciseIds }) => {
        const state = get();
        const todayKey = toLocalDateKey(new Date());
        const prev = state.completedLessons[lessonId];
        const record: LessonRecord = {
          completedAt: new Date().toISOString(),
          perfect: perfect || (prev?.perfect ?? false),
          timesCompleted: (prev?.timesCompleted ?? 0) + 1,
        };
        const completedLessons = { ...state.completedLessons, [lessonId]: record };
        const xp = state.xp + xpEarned;
        const streak = recordActivity(state.streak, todayKey);

        const reviewRecords = { ...state.reviewRecords };
        for (const id of failedExerciseIds) {
          reviewRecords[id] = recordAfterMistake(todayKey);
        }

        const newIds = checkNewAchievements(
          {
            xp,
            streakCount: streak.count,
            completedLessons,
            reviewsCompleted: state.reviewsCompleted,
            units: UNITS,
          },
          state.unlockedAchievements,
        );

        set({
          xp,
          streak,
          completedLessons,
          reviewRecords,
          dailyXp: addDailyXp(state.dailyXp, xpEarned, todayKey),
          unlockedAchievements: [...state.unlockedAchievements, ...newIds],
        });
        return newIds;
      },

      completeReview: ({ xpEarned, results }) => {
        const state = get();
        const todayKey = toLocalDateKey(new Date());
        const xp = state.xp + xpEarned;
        const streak = recordActivity(state.streak, todayKey);
        const reviewsCompleted = state.reviewsCompleted + 1;

        const reviewRecords = { ...state.reviewRecords };
        for (const [id, correct] of Object.entries(results)) {
          reviewRecords[id] = recordAfterReview(reviewRecords[id], correct, todayKey);
        }

        // premio del repaso: recupera un corazón
        const currentHearts = applyRegen(state.hearts, Date.now());
        const hearts: HeartsState = {
          ...currentHearts,
          count: Math.min(MAX_HEARTS, currentHearts.count + 1),
        };

        const newIds = checkNewAchievements(
          {
            xp,
            streakCount: streak.count,
            completedLessons: state.completedLessons,
            reviewsCompleted,
            units: UNITS,
          },
          state.unlockedAchievements,
        );

        set({
          xp,
          streak,
          hearts,
          reviewRecords,
          reviewsCompleted,
          dailyXp: addDailyXp(state.dailyXp, xpEarned, todayKey),
          unlockedAchievements: [...state.unlockedAchievements, ...newIds],
        });
        return newIds;
      },

      setDailyGoal: (goal) => set({ dailyGoal: goal }),

      resetProgress: () => set({ ...INITIAL_FIELDS }),
    }),
    {
      name: 'lingo-progress',
      version: 2,
      // v1 → v2: agrega repaso espaciado y meta diaria a estados guardados
      migrate: (persisted) => ({ ...INITIAL_FIELDS, ...(persisted as Partial<ProgressState>) }),
    },
  ),
);
